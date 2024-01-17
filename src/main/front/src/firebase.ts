// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getToken, getMessaging, onMessage} from "firebase/messaging";
import {getDatabase, ref , set, onValue, get, child} from "firebase/database";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
//const firebaseServiceKey : string = process.env["REACT_APP_FIREBASE_SERVICE_KEY "]
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
const database = getDatabase(app);
const db = getDatabase();
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

/**
 * @code 권환정보 확인, 사용자 인증정보 확인
 */
async function requestPermission() {
        console.log("권한 요청 중...");
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log("알림 권한이 허용됨");
                const token =  getToken(messaging, {
                    vapidKey : vapidKey
                }).then(currentToken => {
                    if (currentToken) {
                        //토큰값 session에 저장
                        sessionStorage.setItem("FCM_TOKEN", currentToken);
                    }
                }).catch(error => {
                    console.error("error : " + error)
                });
            }else if (permission === "denied") {
                console.log("알림 권한 허용 안됨");
                return;
            }
        });

    onMessage(messaging, (payload) => {
        console.log("메시지가 도착했습니다.", payload);
        // ...
    });

    /**
     *$
     * @param userId
     * @param name
     * @param email
     * @param imageUrl
     * @code 실시간DB에 데이터 넣기
     */
// writeUserData("user01", "테스터", "test@test.com", "https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp");
    function writeUserData(userId: string, name: string, email: string, imageUrl: string) {
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            profile_picture : imageUrl
        }).catch(error => {
            console.error("error : " + error);
        });
    }

    /**
     * @code FCM에서 데이터 찾는 코드
     */
    const dbRef = ref(getDatabase());

    function getUserData(userId: string) {
        get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}

requestPermission();
