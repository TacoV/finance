import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

interface Tag {
  id: number
  name: string
  category: string
}

const categories: string[] = ['income', 'need', 'want', 'invest']

const tags = ref<Tag[]>([])

async function retrieveTags() {
  const { error, data } = await supabase.from('tags').select().order('name')
  if (error) {
    console.log('Error retrieving tags', error.message)
  }

  if (data) {
    tags.value = []
    for (const row of data) tags.value.push(row as Tag)
  }
}

async function addNewTag(tagname: string, category: string) {
  await supabase.from('tags').insert({ name: tagname, category: category })
  const { error, data } = await supabase.from('tags').select('*').eq('name', tagname)
  if (error) {
    console.log('Error retrieving tag_id', error.message)
  } else {
    tags.value.push(data[0] as Tag)
  }
}

async function recategorizeTag(tag_id: number, category: string) {
  const { error } = await supabase.from('tags').update({ category: category }).eq('id', tag_id)
  if (error) {
    console.log('Error recategorizing tag', error.message)
  } else {
    const tag = tags.value.find((el) => el.id === tag_id)
    if (tag) tag.category = category
  }
}

async function deleteTag(tag_id: number) {
  await supabase.from('tags').delete().eq('id', tag_id)
  tags.value = tags.value.filter((el) => el.id !== tag_id)
}

async function renameTag(tag_id: number, tag_name: string) {
  const { error } = await supabase.from('tags').update({ name: tag_name }).eq('id', tag_id)
  if (error) {
    console.log('Error renaming tag', error.message)
  } else {
    const tag = tags.value.find((el) => el.id === tag_id)
    if (tag) tag.name = tag_name
  }
}

export { tags, retrieveTags, categories, addNewTag, recategorizeTag, renameTag, deleteTag }
