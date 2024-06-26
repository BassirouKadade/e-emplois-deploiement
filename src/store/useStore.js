import { create } from 'zustand';
import { decodeToken,getSecureLocalStorageItem } from '../services/authUntils';
const useStore = create((set) => ({
  collapsed: false,
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  currentFormateur:{},
  totalPages:{},
  openMenuEmploisPDF:null,


  onHandleOpenMenuEmploisPDF:(event)=> set(() => ({ openMenuEmploisPDF: event.target })),
  onHandleOpenMenuEmploisPDFnull:()=> set(() => ({ openMenuEmploisPDF: null })),
  toggleTotalPages:(totale)=> set(() => ({ totalPages: totale })),
  toggleCuurentFormateur:(formateur)=> set(() => ({ currentFormateur: formateur })),


  // gestion creation d'emplois en PDF
currentIDSelected: { id: null, typeElement: null,chargement:false},
toggleCurrentIDSelected: (id, type) => set((state) => ({
  currentIDSelected: { ...state.currentIDSelected, id: id, typeElement: type }
})),
toggleChargement: (valeur) => set((state) => ({
  currentIDSelected: { ...state.currentIDSelected, chargement: valeur }
})),

toggleReset:() => set(() => ({
  currentIDSelected: {id: null, typeElement: null,chargement:false }
})),


// *****************
// Impression Emplois à partir de Interface de creation
currentFormateurImpression:null,
toggleCurrentFormateurImpression:(state)=> set(() => ({ currentFormateurImpression: state })),

currentSalleImpression:null,
toggleCurrentSalleImpression:(state)=> set(() => ({ currentSalleImpression: state })),



//**************************************/
// =============================================

currentElementToDownload: { typeElement: null},
toglleCurrentElementToDownload: (type) => set((state) => ({
  
  currentElementToDownload: { ...state.currentElementToDownload, typeElement: type }
})),

toggleResetToogleSerachAllPDF:() => set(() => ({
  currentElementToDownload: {typeElement: null }
})),

 user: decodeToken(getSecureLocalStorageItem('_data_user_') || null),
 userAuth: decodeToken(getSecureLocalStorageItem('user_auth') || null),
errorServer:null,
onHandlleErroerServer:(error)=> set(() => ({ errorServer: error }))


}));



export default useStore;

