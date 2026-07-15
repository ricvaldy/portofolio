// Isi data ini dari Firebase Console > Project settings > Your apps > Web app.
// Firebase web config boleh berada di frontend, tetapi Security Rules tetap wajib dibatasi.
export const firebaseConfig = {
  apiKey: "AIzaSyCX4oPw5gMDuyC6PyABUMNcBuKeuGVGgZU",
  authDomain: "ricvaldy-s-portfolio.firebaseapp.com",
  projectId: "ricvaldy-s-portfolio",
  storageBucket: "ricvaldy-s-portfolio.firebasestorage.app",
  messagingSenderId: "336927780483",
  appId: "1:336927780483:web:bc31baf8b147f9eabef5b6",
  measurementId: "G-ZRBKBQS4JH"
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.startsWith("ISI_")
);
