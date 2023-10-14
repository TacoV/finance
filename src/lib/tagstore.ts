import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

interface Tag {
  id: number
  name: string
  category: string
}

const categories: String[] = ['need', 'want', 'invest']

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

export { tags, retrieveTags, categories }
