const USERS_KEY = 'webcitas_users';
function loadUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY)||'[]'); }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

// Ensure default admin exists (username+password: admin1234)
(function ensureAdmin(){
  const users = loadUsers();
  if(!users.find(u => u.name === 'admin1234' && u.role === 'admin')){
    users.push({ name: 'admin1234', role: 'admin', password: 'admin1234' });
    saveUsers(users);
  }
})();

const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authPass = document.getElementById('authPass');
const authRole = document.getElementById('authRole');
const authMsg = document.getElementById('authMsg');

function setActive(mode){
  tabLogin.classList.toggle('active', mode==='login');
  tabRegister.classList.toggle('active', mode==='register');
  // when registering, disallow selecting admin: force role to user
  if(mode === 'register'){
    authRole.value = 'user';
    authRole.disabled = true;
  } else {
    authRole.disabled = false;
  }
}
tabLogin.addEventListener('click', ()=> setActive('login'));
tabRegister.addEventListener('click', ()=> setActive('register'));

authForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = authName.value.trim();
  const pass = authPass.value || '';
  const role = authRole.value;
  if(!name){ authMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  const users = loadUsers();
  if(tabRegister.classList.contains('active')){
    if(users.find(u=>u.name.toLowerCase()===name.toLowerCase())){
      authMsg.textContent = 'Usuario ya registrado.';
      return;
    }
    // force role = user (no admin creation via UI)
    users.push({ name, role: 'user', password: pass });
    saveUsers(users);
    authMsg.textContent = 'Registro correcto. Cambia a "Iniciar sesión".';
    setActive('login');
    return;
  } else {
    const found = users.find(u=>u.name.toLowerCase()===name.toLowerCase() && u.role===role && u.password===pass);
    if(!found){ authMsg.textContent = 'Usuario no encontrado, rol o contraseña incorrectos.'; return; }
    // save current user and redirect
    localStorage.setItem('webcitas_current', JSON.stringify(found));
    location.href = 'schedule.html';
  }
});
