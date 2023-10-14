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
    tags.value = data as Tag[]
  }
}

async function addNewTag(tagname: string, category: string) {
  tags.value.push({
    id: 5555,
    name: tagname,
    category: category
  })
}
async function recategorizeTag(tag_id: number, category: string) {
  const { error } = await supabase.from('tags').update({ category: category }).eq('id', tag_id)
  if (error) {
    console.log('Error recategorizing tag', error.message)
  } else {
    tags.value.find((el) => el.id === tag_id).category = category
  }
}

async function renameTag(tag_id: number, tag_name: string) {
  const { error } = await supabase.from('tags').update({ name: tag_name }).eq('id', tag_id)
  if (error) {
    console.log('Error renaming tag', error.message)
  } else {
    tags.value.find((el) => el.id === tag_id).name = tag_name
  }
}

export { tags, retrieveTags, categories, addNewTag, recategorizeTag, renameTag }
