"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createOffer(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('offers').insert([data])
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function updateOffer(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('offers').update(data).eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function deleteOffer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('offers').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}
