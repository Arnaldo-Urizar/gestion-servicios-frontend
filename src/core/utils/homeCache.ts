// Varible global que tendrá datos de caché
let homeCache: any = null;
let faqCache: any = null;

//Funciones
export const getHomeCache = ()=> homeCache;
export const setHomeCache = (data: any)=> {homeCache = data};
export const clearHomeCache = ()=> {homeCache = null};

//Funciones
export const getFaqCache = ()=> faqCache;
export const setFaqCache = (data: any)=> {faqCache = data};
export const clearFaqCache = ()=> {faqCache = null};