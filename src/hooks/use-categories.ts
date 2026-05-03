"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, CategoryField, CategoryStatus, FieldType } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [fields, setFields] = useState<Record<string, CategoryField[]>>({});
  const [categoryDbIds, setCategoryDbIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: cats, error } = await supabase
          .from("categories")
          .select("*, category_fields(*), payments(*)")
          .eq("user_id", user.id);

        if (error) console.error("useCategories load error:", error);

        if (cats) {
          const catMap: Record<string, Category> = {};
          const fieldMap: Record<string, CategoryField[]> = {};
          const idMap: Record<string, string> = {};

          cats.forEach((c: any) => {
            const payments = (c.payments || [])
              .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((p: any) => ({
                label: p.label,
                amount: p.amount,
                date: p.date || "",
                done: p.done || false,
              }));

            catMap[c.type] = {
              type: c.type,
              name: c.name,
              vendor: c.vendor || "",
              manager: c.manager || "",
              contact: c.contact || "",
              address: c.address || "",
              total: c.total || 0,
              payments,
              eventDate: c.event_date || undefined,
              eventTime: c.event_time || undefined,
              status: c.status,
              notes: c.notes || "",
            };
            idMap[c.type] = c.id;
            fieldMap[c.type] = (c.category_fields || [])
              .map((f: any) => ({
                id: f.id,
                categoryId: f.category_id,
                fieldKey: f.field_key,
                fieldLabel: f.field_label,
                fieldValue: f.field_value || "",
                fieldType: f.field_type || "text",
                fieldOptions: f.field_options || "",
                isCustom: f.is_custom || false,
                sortOrder: f.sort_order || 0,
              }))
              .sort((a: CategoryField, b: CategoryField) => a.sortOrder - b.sortOrder);
          });

          setCategories(catMap);
          setFields(fieldMap);
          setCategoryDbIds(idMap);
        }
      } catch (e) {
        console.error("useCategories exception:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const addField = useCallback(async (
    categoryType: string,
    data: { key: string; label: string; value: string; type: FieldType; options: string; isCustom: boolean }
  ) => {
    const dbId = categoryDbIds[categoryType];
    const newField: CategoryField = {
      id: crypto.randomUUID(),
      categoryId: dbId || "",
      fieldKey: data.key,
      fieldLabel: data.label,
      fieldValue: data.value,
      fieldType: data.type,
      fieldOptions: data.options,
      isCustom: data.isCustom,
      sortOrder: (fields[categoryType]?.length || 0) + 1,
    };

    setFields((prev) => ({
      ...prev,
      [categoryType]: [...(prev[categoryType] || []), newField],
    }));

    if (dbId) {
      try {
        const supabase = createClient();
        const { data: inserted, error } = await supabase.from("category_fields").insert({
          category_id: dbId,
          field_key: data.key,
          field_label: data.label,
          field_value: data.value,
          field_type: data.type,
          field_options: data.options,
          is_custom: data.isCustom,
          sort_order: newField.sortOrder,
        }).select().single();

        if (error) console.error("addField error:", error);
        if (inserted) {
          setFields((prev) => ({
            ...prev,
            [categoryType]: (prev[categoryType] || []).map((f) =>
              f.id === newField.id ? { ...f, id: inserted.id } : f
            ),
          }));
        }
      } catch (e) { console.error("addField exception:", e); }
    }
  }, [categoryDbIds, fields]);

  const updateField = useCallback(async (categoryType: string, fieldId: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [categoryType]: (prev[categoryType] || []).map((f) =>
        f.id === fieldId ? { ...f, fieldValue: value } : f
      ),
    }));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("category_fields").update({ field_value: value }).eq("id", fieldId);
      if (error) console.error("updateField error:", error);
    } catch (e) { console.error("updateField exception:", e); }
  }, []);

  const deleteField = useCallback(async (categoryType: string, fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [categoryType]: (prev[categoryType] || []).filter((f) => f.id !== fieldId),
    }));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("category_fields").delete().eq("id", fieldId);
      if (error) console.error("deleteField error:", error);
    } catch (e) { console.error("deleteField exception:", e); }
  }, []);

  const updateCategory = useCallback(async (
    categoryType: string,
    updates: Partial<{
      vendor: string; manager: string; contact: string; address: string;
      status: CategoryStatus; notes: string; eventDate: string; eventTime: string; total: number;
    }>
  ) => {
    setCategories((prev) => ({
      ...prev,
      [categoryType]: { ...prev[categoryType], ...updates },
    }));
    const dbId = categoryDbIds[categoryType];
    if (dbId) {
      try {
        const supabase = createClient();
        const dbUpdates: Record<string, unknown> = {};
        if (updates.vendor !== undefined) dbUpdates.vendor = updates.vendor;
        if (updates.manager !== undefined) dbUpdates.manager = updates.manager;
        if (updates.contact !== undefined) dbUpdates.contact = updates.contact;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
        if (updates.eventDate !== undefined) dbUpdates.event_date = updates.eventDate;
        if (updates.eventTime !== undefined) dbUpdates.event_time = updates.eventTime;
        if (updates.total !== undefined) dbUpdates.total = updates.total;
        const { error } = await supabase.from("categories").update(dbUpdates).eq("id", dbId);
        if (error) console.error("updateCategory error:", error);
      } catch (e) { console.error("updateCategory exception:", e); }
    }
  }, [categoryDbIds]);

  const addPayment = useCallback(async (
    categoryType: string,
    payment: { label: string; amount: number; date: string }
  ) => {
    const cat = categories[categoryType];
    if (!cat) return;
    const newPayment = { ...payment, done: false };
    const newPayments = [...(cat.payments || []), newPayment];
    setCategories((prev) => ({
      ...prev,
      [categoryType]: { ...prev[categoryType], payments: newPayments },
    }));
    const dbId = categoryDbIds[categoryType];
    if (dbId) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("payments").insert({
          category_id: dbId,
          label: payment.label,
          amount: payment.amount,
          date: payment.date,
          done: false,
          sort_order: newPayments.length,
        });
        if (error) console.error("addPayment error:", error);
      } catch (e) { console.error("addPayment exception:", e); }
    }
  }, [categories, categoryDbIds]);

  const togglePayment = useCallback(async (categoryType: string, paymentIndex: number) => {
    const cat = categories[categoryType];
    if (!cat) return;
    const newPayments = cat.payments.map((p, i) =>
      i === paymentIndex ? { ...p, done: !p.done } : p
    );
    setCategories((prev) => ({
      ...prev,
      [categoryType]: { ...prev[categoryType], payments: newPayments },
    }));
    // Note: payment toggle DB update requires payment IDs — stored locally only for now
    // Full implementation would need payment IDs from DB
  }, [categories]);

  return { categories, fields, loading, addField, updateField, deleteField, updateCategory, addPayment, togglePayment };
}
