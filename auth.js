const USERS_KEY = 'webcitas_users';
function loadUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY)||'[]'); }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authRole = document.getElementById('authRole');
const authMsg = document.getElementById('authMsg');

function setActive(mode){
  tabLogin.classList.toggle('active', mode==='login');
  tabRegister.classList.toggle('active', mode==='register');
}
tabLogin.addEventListener('click', ()=> setActive('login'));
tabRegister.addEventListener('click', ()=> setActive('register'));

authForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = authName.value.trim();
  const role = authRole.value;
  if(!name){ authMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  const users = loadUsers();
  if(tabRegister.classList.contains('active')){
    if(users.find(u=>u.name.toLowerCase()===name.toLowerCase())){
      authMsg.textContent = 'Usuario ya registrado.';
      return;
    }
    users.push({ name, role });
    saveUsers(users);
    authMsg.textContent = 'Registro correcto. Cambia a "Iniciar sesión".';
    setActive('login');
    return;
  } else {
    const found = users.find(u=>u.name.toLowerCase()===name.toLowerCase() && u.role===role);
    if(!found){ authMsg.textContent = 'Usuario no encontrado o rol incorrecto.'; return; }
    // save current user and redirect
    localStorage.setItem('webcitas_current', JSON.stringify(found));
    location.href = 'schedule.html';
  }
});
