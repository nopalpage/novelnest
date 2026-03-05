import { signIn, signUp } from '../lib/auth.js'
import { toastSuccess, toastError } from '../lib/toast.js'

export function openAuthModal(tab = 'login') {
  const root = document.getElementById('modal-root')
  root.innerHTML = _html()
  const overlay = document.getElementById('auth-overlay')
  requestAnimationFrame(() => overlay.classList.add('open'))
  _bind(tab)
}

function _close() {
  const overlay = document.getElementById('auth-overlay')
  if (!overlay) return
  overlay.classList.remove('open')
  setTimeout(() => { if (overlay) overlay.remove() }, 200)
}

function _html() {
  return `
  <div class="modal-overlay" id="auth-overlay">
    <div class="modal-box w-[380px]">
      <div class="modal-header">
        <div class="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#191917"/><rect x="8" y="9" width="7" height="11" rx="1" fill="#e8c89a"/><rect x="17" y="9" width="7" height="11" rx="1" fill="#c9a060"/><rect x="15.5" y="8.5" width="1" height="12" rx=".5" fill="#f5e0b8"/><path d="M6 23 Q16 18.5 26 23" stroke="#c9a060" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>
          <span class="modal-title">NovelNest</span>
        </div>
        <button class="btn btn-icon btn-ghost text-ink-3" id="auth-close">✕</button>
      </div>

      <div class="tabs px-6 pt-2">
        <div class="tab active" data-tab="login"    id="tab-login">Sign in</div>
        <div class="tab"        data-tab="register" id="tab-register">Register</div>
      </div>

      <div class="modal-body pt-4">
        <!-- Login -->
        <div id="form-login">
          <div class="form-field">
            <label class="label">Email</label>
            <input class="input" type="email" id="l-email" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="form-field">
            <label class="label">Password</label>
            <input class="input" type="password" id="l-pass" placeholder="••••••••" autocomplete="current-password" />
          </div>
          <button class="btn btn-primary btn-lg w-full mt-1" id="btn-do-login">Sign in</button>
          <p class="text-center text-[12px] text-ink-3 mt-3"><a href="/forgot" class="text-accent">Forgot password?</a></p>
        </div>
        <!-- Register -->
        <div id="form-register" class="hidden">
          <div class="form-field">
            <label class="label">Username</label>
            <input class="input" type="text" id="r-user" placeholder="YourName" autocomplete="username" />
          </div>
          <div class="form-field">
            <label class="label">Email</label>
            <input class="input" type="email" id="r-email" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="form-field">
            <label class="label">Password</label>
            <input class="input" type="password" id="r-pass" placeholder="Min. 8 characters" autocomplete="new-password" />
          </div>
          <button class="btn btn-primary btn-lg w-full mt-1" id="btn-do-register">Create account</button>
          <p class="text-center text-[12px] text-ink-3 mt-3">By joining you agree to our <a href="/terms" class="text-accent">Terms</a></p>
        </div>
      </div>
    </div>
  </div>`
}

function _bind(defaultTab) {
  _switchTab(defaultTab)

  document.getElementById('auth-close')?.addEventListener('click', _close)
  document.getElementById('auth-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'auth-overlay') _close()
  })
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { _close(); document.removeEventListener('keydown', esc) }
  })

  document.querySelectorAll('.tab[data-tab]').forEach(t =>
    t.addEventListener('click', () => _switchTab(t.dataset.tab))
  )

  document.getElementById('btn-do-login')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget
    const email = document.getElementById('l-email').value.trim()
    const pass  = document.getElementById('l-pass').value
    if (!email || !pass) { toastError('Fill all fields'); return }
    btn.disabled = true; btn.textContent = 'Signing in…'
    try { await signIn(email, pass); _close(); toastSuccess('Welcome back! 👋') }
    catch(err) { toastError(err.message) }
    finally { btn.disabled = false; btn.textContent = 'Sign in' }
  })

  document.getElementById('btn-do-register')?.addEventListener('click', async (e) => {
    const btn  = e.currentTarget
    const user  = document.getElementById('r-user').value.trim()
    const email = document.getElementById('r-email').value.trim()
    const pass  = document.getElementById('r-pass').value
    if (!user || !email || !pass) { toastError('Fill all fields'); return }
    if (pass.length < 8) { toastError('Password 8+ characters'); return }
    btn.disabled = true; btn.textContent = 'Creating…'
    try { await signUp(email, pass, user); _close(); toastSuccess('Welcome to NovelNest! 🎉') }
    catch(err) { toastError(err.message) }
    finally { btn.disabled = false; btn.textContent = 'Create account' }
  })
}

function _switchTab(tab) {
  document.querySelectorAll('.tab[data-tab]').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab)
  )
  document.getElementById('form-login').classList.toggle('hidden',    tab !== 'login')
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register')
}
