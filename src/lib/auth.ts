import { supabase } from '@/lib/supabase'
import { retrieveFiles } from '@/lib/filestore'
import { type Session } from '@supabase/gotrue-js/dist/main/lib/types'
import { ref } from 'vue'

const userSession = ref<Session | null>(null)

function getUid() {
  return userSession.value?.user.id
}

supabase.auth.onAuthStateChange((event, session) => {
  userSession.value = session
  if (getUid()) {
    retrieveFiles()
  }
})

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) {
    alert('Error logging in: ' + error.message)
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert('Error logging out: ' + error.message)
  }
}

export { userSession, getUid, signInWithGoogle, signOut }
