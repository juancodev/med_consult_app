import { 
    getAuth, 
    signOut,
    setPersistence, 
    browserSessionPersistence
  } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js';
  
  import { app } from '/firebase/firebase.config.client.js';
  
  const auth = getAuth(app);
  
  let token;
  
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log("Persistence set to browserSessionPersistence");
      const user = auth.currentUser;
      if (user) {
        // El usuario está autenticado
        user.getIdToken().then(async (idToken) => {
          token = idToken;
        }).catch((error) => {
          console.error('Error al obtener el token:', error);
        });
      } else {
        // El usuario no está autenticado
        window.location.pathname = '/';
        console.error('El usuario no está autenticado');
      }
    })
    .catch((error) => {
      console.error("Error setting persistence:", error);
    });
  

export const getPaciente = async () => {
    const dataList = await fetch(`http://localhost:3100/api/consultaSecretario/${window.location.pathname.split('/')[2]}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const idPaciente = dataList.url.split('/')[5];
    const dataResult = await dataList.json();
    return {
        idPaciente,
        datosDelPaciente: dataResult.message,
    };
  }
  
export const updatePaciente = async (pacienteId, pacienteData) => {
    console.log(pacienteId, pacienteData);
    const sendData = await fetch(`http://localhost:3100/api/consultaSecretario/${pacienteId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pacienteData),
    });
    const updatedPaciente = await sendData.json();
    return updatedPaciente;
}


    const btnFinalizar = document.getElementById('btnFinalizar')

    btnFinalizar.addEventListener('click', () => {
      window.location.pathname = '/busquedaSecretario';
    })