"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Category, CategoryField, FieldType } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Record<string, Category>>(MOCK_CATEGORIES);
  const [fields, setFields] = useState<Record<string, CategoryField[]>>({});
  const [categoryDbIds, setCategoryDbIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: cats } = await supabase
          .from("categories")
          .select("*, category_fields(*)")
          .eq("user_id", user.id);

        if (cats && cats.length > 0) {
          const catMap: Record<string, Category> = {};
          const fieldMap: Record<string, CategoryField[]> = {};
          const idMap: Record<string, string> = {};

          cats.forEach((c: any) => {
            catMap[c.type] = {
              type: c.type,
              name: c.name,
              vendor: c.vendor || "",
              manager: c.manager || "",
              contact: c.contact || "",
              address: c.address || "",
              total: c.total || 0,
              payments: [],
              eventDate: c.event_date || undefined,
              eventTime: c.event_time || undefined,
              status: c.status,
              notes: c.notes || "",
            };
            idMap[c.type] = c.id;
            fieldMap[c.type] = (c.category_fields || []).map((f: any) => ({
              id: f.id,
              categoryId: f.category_id,
              fieldKey: f.field_key,
              fieldLabel: f.field_label,
              fieldValue: f.field_value || "",
              fieldType: f.field_type || "text",
              fieldOptions: f.field_options || "",
              isCustom: f.is_custom || false,
              sortOrder: f.sort_order || 0,
            })).sort((a: CategoryField, b: CategoryField) => a.sortOrder - b.sortOrder);
          });

          setCategories(catMap as Record<string, Category>);
          setFields(fieldMap);
          setCategoryDbIds(idMap);
        }
      } catch { /* fallback to mock */ }
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
        const { data: inserted } = await supabase.from("category_fields").insert({
          category_id: dbId,
          field_key: data.key,
          field_label: data.label,
          field_value: data.value,
          field_type: data.type,
          field_options: data.options,
          is_custom: data.isCustom,
          sort_order: newField.sortOrder,
        }).select().single();

        if (inserted) {
          setFields((prev) => ({
            ...prev,
            [categoryType]: (prev[categoryType] || []).map((f) =>
              f.id === newField.id ? { ...f, id: inserted.id } : f
            ),
          }));
        }
      } catch { /* local state already updated */ }
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
      await supabase.from("category_fields").update({ field_value: value }).eq("id", fieldId);
    } catch { /* ignore */ }
  }, []);

  const deleteField = useCallback(async (categoryType: string, fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [categoryType]: (prev[categoryType] || []).filter((f) => f.id !== fieldId),
    }));

    try {
      const supabase = createClient();
      await supabase.from("category_fields").delete().eq("id", fieldId);
    } catch { /* ignore */ }
  }, []);

  return { categories, fields, loading, addField, updateField, deleteField };
}
