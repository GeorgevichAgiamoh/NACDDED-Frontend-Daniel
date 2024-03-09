import axios, { AxiosResponse } from "axios"



export const endpoint = 'https://api.nacdded.org.ng/api'//http://127.0.0.1:8000/api

export function getACT(){
    return localStorage.getItem('nacdded_act') ?? ''
  }

export class makeRequest{

    static post(path:string,data:any,finise:(task:resHandler)=>void,isAuth?:boolean){
        axios.post(`${endpoint}/${path}`, data, {headers:{
            "Content-Type":'application/json',
            Authorization:`Bearer ${getACT()}`
        }}).then(response => {
            finise(new resHandler(response,isAuth))
        })
        .catch(error => {
            finise(new resHandler(error.response))
        });
    }

    static get(path:string,params:any,finise:(task:resHandler)=>void){
        axios.get(`${endpoint}/${path}`,{params:params, headers:{
            "Content-Type":'application/json',
            Authorization:`Bearer ${getACT()}`
        }})
        .then(response => {
            finise(new resHandler(response))
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Response:', error.response);
            finise(new resHandler(error.response))
        });
    }

    static uploadFile(folder:string, filename:string,diocese_id:string,file:File,finise:(task:resHandler)=>void){
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', filename);
        formData.append('folder', folder);
        formData.append('diocese_id', diocese_id);

        axios.post(`${endpoint}/uploadFile`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:`Bearer ${getACT()}`
            },
        }).then((response)=>{
            finise(new resHandler(response,false))
        }).catch((e)=>{
            console.error('Error uploading file:', e);
            finise(new resHandler(e.response))
        })
    }

    static getFile(folder:string, filename:string,finise:(task:resHandler)=>void){ //TODO later

    }

}

export class resHandler{
    response?: AxiosResponse<any, any>
    constructor(response?: AxiosResponse<any, any>,isAuth?:boolean){
        this.response = response
        if(isAuth && this.isSuccessful()){
            localStorage.setItem('nacdded_act',response!.data.token)
        }
    }
    getData(customPld?:string){
        return this.response!.data[customPld??'pld']
    }
    exists(){
        return this.response?.data.pld != undefined && this.response?.data.pld != null
    }
    isSuccessful(){
        return this.response && this.response.status == 200 && (this.response.data.status as boolean)
    }
    isLoggedOut(){
        return (this.response?.status ?? 0) == 401
    }
    getErrorMsg(){
        if(!this.response){
            return 'An error occurred'
        }
        if(this.response.status == 200){
            return this.response.data.message
        }else{
            console.error(this.response.data)
            return this.response.data.message ?? `Request Failed (${this.response.status})`
        }
    }
  }

  export function saveDioceseId(diod:string){
    localStorage.setItem('diod',diod)
  }

  export function getDioceseId(){
    return localStorage.getItem('diod') ?? ''
  }

  export function saveSecretaryEmail(eml:string){
    localStorage.setItem('seml',eml)
  }

  export function getSecretaryEmail(){
    return localStorage.getItem('seml') ?? ''
  }