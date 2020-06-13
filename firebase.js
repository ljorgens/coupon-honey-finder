// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    databaseURL: env.databaseURL,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if(msg.command === 'fetch'){
        const domain = msg.data.domain;
        const enc_domain = btoa(domain);
        firebase.database().ref('/domain/'+enc_domain).once('value').then(function(snapshot){
            response({type: "result", status: "success", data: snapshot.val(), request: msg})
        })
    }
    //submit coupon data..
    if(msg.command === 'post'){
        const domain = msg.data.domain;
        const enc_domain = btoa(domain);
        const code = msg.data.code;
        const desc = msg.data.desc;
        try {
            const newPost = firebase.database().ref('/domain/'+enc_domain).push().set({
                code:code,
                description: desc
            });
            const postId = newPost.key;
            response({type: "result", status: "success", data:postId, request: msg})
        } catch(e){
            console.log("error:", e);
            response({type: "result", status: "error", data:e, request: msg});
        }
    }
    return true;

})
