const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const photoResult = document.getElementById('photo-result');
const resultContainer = document.getElementById('result-container');
const downloadLink = document.getElementById('download-link');
const frameOverlay = document.getElementById('frame-overlay');

// 1. Accéder à la caméra avec des paramètres de taille
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
            audio: false 
        });
        video.srcObject = stream;
        
        // On attend que la vidéo soit vraiment prête pour éviter les dimensions à 0
        video.onloadedmetadata = () => {
            video.play();
            console.log("Caméra prête !");
        };
    } catch (e) {
        console.error("Erreur d'accès à la caméra :", e);
        alert("Erreur : Vérifiez que vous êtes bien en HTTPS et que vous avez autorisé la caméra.");
    }
}

// 2. Prendre la photo
snap.addEventListener('click', () => {
    // Vérifier si la vidéo diffuse bien
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("La vidéo n'est pas encore prête. Attendez une seconde.");
        return;
    }

    const context = canvas.getContext('2d');
    
    // On synchronise la taille du canvas sur la taille RÉELLE du flux vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Étape A : Dessiner la vidéo
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Étape B : Dessiner le cadre (on le force à la même taille que la vidéo)
    context.drawImage(frameOverlay, 0, 0, canvas.width, canvas.height);

    // Étape C : Générer l'image
    try {
        const data = canvas.toDataURL('image/png');
        photoResult.src = data;
        downloadLink.href = data;
        resultContainer.style.display = 'block';
        
        // Scroll automatique vers le résultat pour mobile
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        console.error("Erreur lors de la création de l'image :", err);
        alert("Le navigateur bloque la capture (souvent un problème de domaine/CORS avec l'image du cadre).");
    }
});

initCamera();