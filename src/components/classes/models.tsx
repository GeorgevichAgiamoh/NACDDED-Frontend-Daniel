import { format } from "date-fns"
import { mCountry, mLga, mState } from "monagree-locs"
import { masterID, myEles, spin_genders } from "../../helper/general"
import { mBanks } from "monagree-banks"
import { endpoint, makeRequest } from "../../helper/requesthandler"


export class dioceseBasicinfo{
    data:any
    generalData:dioceseGeneralinfo
    secretaries:dioceseSecretaryInfo[]
    constructor(data:any){
        this.data = data
        this.generalData = new dioceseGeneralinfo(null)
        this.secretaries = []
    }
    getDioceseID(){
        return this.data['diocese_id']
    }
    getName(){
        return this.data['name']
    }
    getPhone(){
        return this.data['phn']
    }
    isVerified(){
        return this.data['verif']=='1'
    }

    //--Custom
    setGeneralData(generalData:dioceseGeneralinfo){
        this.generalData = generalData;
    }

    setSecretaries(secretaries:dioceseSecretaryInfo[]){
        this.secretaries = secretaries;
    }

    isPrepared(){
        return this.generalData?.data!=null && this.secretaries.length!=0
    }
}

export const defVal = 'NIL'

export class dioceseGeneralinfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getDioceseId(){
        return !this.data?defVal:this.data['diocese_id']
    }
    getState(){
        return !this.data?defVal:this.data['state']
    }
    getLga(){
        return !this.data?defVal:this.data['lga']
    }
    getAddr(){
        return !this.data?defVal:this.data['addr']
    }

    getCountry(){
        return 'NG' //ie Nigeria
    }

    getFormattedState(){
        return !this.data?defVal:mState.getStateByCode(this.getCountry(),this.getState())!.getName()
    }
    getFormattedLGA(){
        return !this.data?defVal:mLga.getLgaByCode(this.getCountry(),this.getState(),this.getLga())!.getName()
    }
    
}


export class dioceseSecretaryInfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getDioceseID(){
        return !this.data?defVal:this.data['diocese_id']
    }
    getEmail(){
        return !this.data?defVal:this.data['email']
    }
    getFirstName(){
        return !this.data?defVal:this.data['fname']
    }
    getMiddleName(){
        return !this.data?defVal:this.data['mname']
    }
    getLastName(){
        return !this.data?defVal:this.data['lname']
    }
    getSex(){
        return !this.data?defVal:this.data['sex']
    }
    getPhone(){
        return !this.data?defVal:this.data['phn']
    }
    getAddr(){
        return !this.data?defVal:this.data['addr']
    }
    //--CUSTOM
    getFormattedGender(){
        return spin_genders[this.getSex()]
    }
}

export class highlightEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    totalSchools(){
        return this.data['totalSchools']
    }
    totalDiocese(){
        return this.data['totalDiocese']
    }
}


export class eventEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getEventId(){
        return this.data?this.data['id']:defVal
    }
    getTitle(){
        return this.data?this.data['title']:defVal
    }
    getVenue(){
        return this.data?this.data['venue']:defVal
    }
    getFee(){
        return this.data?this.data['fee']:defVal
    }
    isFree(){
        return this.getFee() == '0'
    }
    getStart(){
        return this.data?parseFloat(this.data['start']):defVal
    }
    getEnd(){
        return this.data?parseFloat(this.data['end']):defVal
    }
    getTheme(){
        return this.data?this.data['theme']:defVal
    }
    getSpeakers(){
        const speakers:string[] = []
        const tem = this.data?(this.data['fee'] as string):''
        if(tem.includes(',')){
            tem.split(',').forEach((st,i)=>{
                if(st.length >0){
                    speakers.push(st)
                }
            })
        }
        return speakers
    }

    //---CUSTOM
    getDay(){
        if(!this.data){
            return ''
        }
        const date = new Date(parseFloat(this.data['time']));
        return date.getDate().toString();
    }
    getMonth(){
        if(!this.data){
            return ''
        }
        const date = new Date(parseFloat(this.data['time']));
        return date.toLocaleString('default', { month: 'short' });
    }
    getDate(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['time'])),'dd/MM/yy')
    }
    getUnformattedDate(){
        if(this.data){
            return new Date(parseFloat(this.data['time']))
        }
        return new Date(100000000)
    }
    getStartDate(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['start'])),'dd/MM/yy')
    }
    getEndDate(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['end'])),'dd/MM/yy')
    }
    getTime(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['time'])),'hh:mm a')
    }
    getStartTime(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['start'])),'hh:mm a')
    }
    getEndTime(){
        if(!this.data){
            return ''
        }
        return format(new Date(parseFloat(this.data['end'])),'hh:mm a')
    }
    

}



export class annEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getId(){
        return this.data['id']
    }
    getTitle(){
        return this.data['title']
    }
    getMsg(){
        return this.data['msg']
    }
    getTime(){
        return format(new Date(parseFloat(this.data['time'])),'dd/MM/yy')
    }
}




export class verifStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotalVerified(){
        return this.data['totalVerified']
    }
    getTotalUnverified(){
        return this.data['totalUnverified']
    }
}

export function getCreatedTime(data:any,includeTime?:boolean){
    const ct = data['created_at'] as string
    const createdAtDate = new Date(ct);
    const formattedDate = format(createdAtDate, 'dd/MM/yy');
    const formattedTime = format(createdAtDate, 'HH:mm:ss');
    return includeTime?formattedDate+' '+formattedTime:formattedDate
}


export class payRecordEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getRecordId(){
        return this.data['id']
    }
    getDioceseId(){
        return this.data['diocese_id']
    }
    getRef(){
        return this.data['ref']
    }
    getName(){
        return this.data['name']
    }
    getTime(){
        return this.data['time']
    }
    //---NULLABLE
    getYear(){
        return this.data['year']
    }
    getEventId(){
        return this.data['event']
    }
    getProof(){
        if(this.isProofFile()){
            return this.getDioceseId()+'_'+this.getTime()
        }
        return this.data['proof']
    }
    isProofFile(){
        return this.data['proof'] == 'f'
    }
    //--CUSTOM
    getAmt(){
        return (this.getRef() as string).split('-')[2]
    }
    getReceiptId(){
        return (this.getRef() as string).split('-')[4]
    }
    getPayTypeId(){
        return (this.getRef() as string).split('-')[1]
    }
    getInterval(){
        return this.getPayTypeId()=='0'?'One Time':this.getPayTypeId()=='1'?'Annual':'None'
    }
    getType(){
        return this.getPayTypeId()=='0'?'Annual Due':'Event Reg'
    }
    getDate(){
        return format(new Date(parseFloat(this.getTime())),'dd/MM/yy')
    }
    getColor(mye:myEles){
        return this.getPayTypeId()=='0'?mye.mycol.secondarycol:mye.mycol.primarycol
    }
}



export class eventRegEle{
    data:any
    event:eventEle
    recall?:()=>void
    constructor(data:any, dontGetEvent?:boolean){
        this.data = data
        this.event = new eventEle(null)
        //Get Event
        if(!dontGetEvent){
            makeRequest.get(`getEvent/${this.getEventId()}`,{},(task)=>{
                if(task.isSuccessful() && task.exists()){
                    this.event = new eventEle(task.getData())
                    if(this.recall){
                        this.recall()
                    }
                }
            })
        }else{
            
        }
        
    }
    getEventId(){
        return this.data['event_id']
    }
    getDioceseId(){
        return this.data['diocese_id']
    }
    isProofFile(){
        return this.data['proof']=='f'
    }
    isVerified(){
        return this.data['verif'] == '1'
    }

    //-- CUSTOM
    registerRecall(recall:()=>void){
        this.recall = recall
    }
}


export class nacddedInfoEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getName(){
        return this.data['cname']
    }
    getRegNo(){
        return this.data['regno']
    }
    getAddr(){
        return this.data['addr']
    }
    isLocsCustom(){
        return mCountry.getCountryByCode(this.getNationality()) == undefined
    }
    getNationality(){
        return this.data['nationality']
    }
    getState(){
        return this.data['state']
    }
    getLga(){
        return this.data['lga']
    }
    getAccountName(){
        return this.data['aname']
    }
    getAccountNumber(){
        return this.data['anum']
    }
    getBankCode(){
        return this.data['bnk']
    }
    getPersonalName(){
        return this.data['pname']
    }
    getPersonalEmail(){
        return this.data['peml']
    }
    getPersonalPhone(){
        return this.data['pphn']
    }
    getPersonalAddr(){
        return this.data['paddr']
    }
    //-- CUSTOM
    getFormattedbank(){
        return mBanks.getBankByCode(this.getBankCode())!.name
    }
}



export class adminUserEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getLastName(){
        return this.data['lname']
    }
    getOtherNames(){
        return this.data['oname']
    }
    getEmail(){
        return this.data['email']
    }
    getRole(){
        return this.data['role']
    }
    getPerm(permId:string){
        return this.data[permId]
    }
    //-- CUSTOM
    getNames(){
        return this.getOtherNames()+' '+this.getLastName()
    }
    getFormattedRole(){
        if(this.getRole()=='1'){
            return 'Others'
        }
        return 'Super Admin'
    }
}

export class permHelp{
    name:string;
    id:string;
    val:string;
    constructor(name:string,id:string){
        this.name = name
        this.id = id
        this.val = '0'
    }
}



export class fileEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getName(){
        return this.data['file']
    }
    getFolder(){
        return this.data['folder']
    }
}


export class payStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotal(){
        return this.data['total']
    }
    getCount(){
        return this.data['count']
    }
}


export class eventRegStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotal(){
        return this.data['totalRegs']
    }
}



export class eventStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    totalEvents(){
        return this.data['totalEvents']
    }
}


export class msgStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotalMessages(){
        return this.data['totalMessages']
    }
}



export class msgThread{
    data:any
    constructor(data:any){
        this.data = data
    }
    
    getThreadId(){
        return this.data['id']
    }
    getFromName(){
        return this.data['from']
    }
    getToName(){
        return this.data['to']
    }
    getFromMail(){
        return this.data['from_mail']
    }
    getToMail(){
        return this.data['to_mail']
    }
    getFromId(){
        return this.data['from_uid']
    }
    getToId(){
        return this.data['to_uid']
    }
    getLastMsg(){
        return this.data['last_msg']
    }
    getSubject(){
        return this.data['subject']
    }

    //--CUSTOM
    amFrom(userId:string,isAdmin?:boolean){
        return this.data['from_uid'] == (isAdmin?masterID:userId)
    }
    getLastUpdated(){
        return getUpdatedTime(this.data)
    }
    getNameById(id:string){
        if(id == this.getFromId()){
            return this.getFromName()
        }
        return this.getToName()
    }
}


export function getUpdatedTime(data:any,includeTime?:boolean){
    const ct = data['updated_at'] as string
    const createdAtDate = new Date(ct);
    const formattedDate = format(createdAtDate, 'dd/MM/yy');
    const formattedTime = format(createdAtDate, 'HH:mm:ss');
    return includeTime?formattedDate+' '+formattedTime:formattedDate
}




export class msgEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getThreadId(){
        return this.data['tid']
    }
    getBody(){
        return this.data['body']
    }
    getWho(){
        return this.data['who']
    }
    getArt(){
        return this.data['art']
    }

    //-- CUSTOM
    getArtUrl(){
        return `${endpoint}/getFile/msg/${this.getArt()}`
    }
    isArtImage(){
        return (this.data['art'] as string).startsWith('img')
    }
    hasArt(){
        return this.data['art'] != '_'
    }
    isMe(userId:string,isAdmin?:boolean){
        return this.data['who'] == (isAdmin?masterID:userId)
    }
    getTime(){
        return getCreatedTime(this.data)
    }
}