import { useEffect, useRef, useState } from "react";
import { Add, CalendarMonth, InfoOutlined } from "@mui/icons-material";
import coin from '../../assets/coin.png'
import thumb from '../../assets/thumbs.png'
import { CustomCountryTip, MsgAlert, PoweredBySSS } from "../../helper/nacdded";
import useWindowDimensions from "../../helper/dimension";
import { myEles, setTitle, appName, Mgin, EditTextFilled, Btn, useQuery, ErrorCont, isEmlValid, isPhoneNigOk, LrText, DatePicky, IconBtn, LoadLay, spin_genders } from "../../helper/general";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Toast from "../toast/toast";
import { getDioceseId, makeRequest } from "../../helper/requesthandler";
import { format } from "date-fns";
import { mLoc } from "monagree-locs/dist/classes";
import { mCountry, mLga, mState } from "monagree-locs";
import { mBanks } from "monagree-banks";
import { dioceseBasicinfo, dioceseGeneralinfo, dioceseSecretaryInfo } from "../classes/models";


export function SecretaryProfile(prop:{ele?:dioceseSecretaryInfo}){
    const[mykey,setMyKey] = useState(Date.now())
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const navigate = useNavigate()

    const[eml,setEml] = useState('')
    const[fname,setFName] = useState('')
    const[mname,setMName] = useState('')
    const[lname,setLName] = useState('')
    const[sex,setSex] = useState('')
    const[phn,setPhn] = useState('')
    const[addr,setAddr] = useState('')

    useEffect(()=>{
        if(prop.ele){
            setEml(prop.ele.getEmail())
            setFName(prop.ele.getFirstName())
            setMName(prop.ele.getMiddleName())
            setLName(prop.ele.getLastName())
            setSex(prop.ele.getSex())
            setPhn(prop.ele.getPhone())
            setAddr(prop.ele.getAddr())
            setMyKey(Date.now())
        }
    },[])

    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
      var _delay = delay || 5000
      setToastMeta({
          action: action,
          msg: msg,
          visible:true,
          invoked: Date.now()
      })
      clearTimeout(timy.timer)
      setTimy({
          timer:setTimeout(()=>{
              if(Date.now()-toastMeta.invoked > 4000){
                  setToastMeta({
                      action:2,
                      msg:"",
                      visible:false,
                      invoked: 0
                  })
              }
          },_delay)
      });
    }

    return <div key={mykey} style={{
        width:'100%',
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)

        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <div className="hlc" style={{
            width:'100%'
        }}>
            <div style={{
                flex:1
            }}>
                <mye.Tv text="*First Name" />
                <Mgin top={5} />
                <EditTextFilled hint="First Name" value={fname} noSpace min={3} recv={(v)=>{
                    setFName(v.trim())
                }} />
            </div>
            <div style={{
                flex:1,
                marginLeft:20
            }}>
                <mye.Tv text="*Middle Name" />
                <Mgin top={5} />
                <EditTextFilled hint="Middle Name" value={mname} noSpace min={3} recv={(v)=>{
                    setMName(v.trim())
                }} />
            </div>
            <div style={{
                flex:1,
                marginLeft:20
            }}>
                <mye.Tv text="*Last Name" />
                <Mgin top={5} />
                <EditTextFilled hint="Last Name" value={lname} noSpace min={3} recv={(v)=>{
                    setLName(v.trim())
                }} />
            </div>
        </div>
        <Mgin top={5}/>
        <div style={{
            width:'100%',
        }}>
            <mye.Tv text="*Gender" />
            <Mgin top={5}/>
            <select id="dropdown" name="dropdown" value={sex} onChange={(e)=>{
                setSex(e.target.value)
            }}>
                <option value="">Click to Choose</option>
                {Object.entries(spin_genders).map(([key,value])=>{
                    return <option value={key}>{value}</option>
                })}
            </select>
        </div>
        <Mgin top={5}/>
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="*Phone Number" />
            <Mgin top={5} />
            <EditTextFilled hint="08012345678" value={phn} digi noSpace min={11} max={11} recv={(v)=>{
                setPhn(v.trim())
            }} />
        </div>
        <Mgin top={5}/>
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="*Residential Address Of Secretary" />
            <Mgin top={5} />
            <EditTextFilled hint="Residential Address" value={addr} min={3} recv={(v)=>{
                setAddr(v.trim())
            }} />
        </div>
        <Mgin top={5}/>
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="*Email Address" />
            <Mgin top={5} />
            <EditTextFilled hint="Enter Email Address" value={eml} noSpace min={0} recv={(v)=>{
                setEml(v.trim())
            }} />
        </div>
        <Mgin top={35} />
        <Btn txt="SAVE SECRETARY INFO" onClick={()=>{
            if(fname.length < 3 || lname.length < 3 || mname.length < 3){
                toast('Invalid Name Input',0)
                return;
            }
            if(!isEmlValid(eml)){
                toast('Invalid Email',0)
                return
            }
            if(!isPhoneNigOk(phn)){
                toast('Invalid Phone Number',0)
                return
            }
            if(sex.length == 0){
                toast('Invalid gender Input',0)
                return
            }
            if(addr.length < 3){
                toast('Invalid Address Input',0)
                return;
            }
            setLoad(true)
            makeRequest.post('setSecretaryInfo',{
                email:eml,
                fname:fname,
                mname:mname,
                lname:lname,
                sex:sex,
                phn:phn,
                addr:addr,
                diocese_id:getDioceseId(),
            },(task)=>{
                setLoad(false)
                if(task.isSuccessful()){
                    toast('Secretary Info update successful',1)
                }else{
                    if(task.isLoggedOut()){
                        navigate('/login')
                        return
                    }
                    toast(task.getErrorMsg(),0)
                }
            })
        }} />
    </div>


}


export function CompleteProfile(){
    const qry = useQuery();
    const [myKey,setMyKey] = useState(Date.now())
    const rdr = qry.get('rdr') ?? ''
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[rdy, setRdy] = useState(false)

    const[dname,setDName] = useState('')
    const[phn,setPhn] = useState('')

    const nationality = mCountry.getCountryByCode('NG')

    const[state,setState] = useState<mLoc>()
    const[lga,setLga] = useState<mLoc>()
    const[addr,setAddr] = useState('')

    const[secretaries, setSecretaries] = useState<secLayMan[]>([])

    const[mbi,setMbi] = useState<dioceseBasicinfo>()

    useEffect(()=>{
        setTitle(`Edit Your Profile - ${appName}`)
        getMemInfo()
    },[])

    function getMemInfo(){
        setError(false)
        setRdy(false)
        if(getDioceseId().length==0){
            navigate('/login')
            return;
        }
        makeRequest.get(`getDioceseBasicInfo/${getDioceseId()}`,{},(task)=>{
            if(task.isSuccessful()){
                const mbi = new dioceseBasicinfo(task.getData())
                setDName(mbi.getName())
                setPhn(mbi.getPhone())
                setMbi(mbi)
                makeRequest.get(`getDioceseGeneralInfo/${getDioceseId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        if(task.exists()){
                            const mgi = new dioceseGeneralinfo(task.getData())
                            setState(mState.getStateByCode(mgi.getCountry(), mgi.getState()))
                            setLga(mLga.getLgaByCode(mgi.getCountry(),mgi.getState(),mgi.getLga()))
                            setAddr(mgi.getAddr())
                        }
                        makeRequest.get(`getDioceseSecretaries/${getDioceseId()}`,{},(task)=>{
                            if(task.isSuccessful()){
                                if(task.exists()){
                                    let lid = 0 
                                    let tem:secLayMan[] = []
                                    for (let key in task.getData()){
                                        tem.push(new secLayMan(lid.toString(),new dioceseSecretaryInfo(task.getData()[key])))
                                        lid = lid+1
                                    }
                                    setSecretaries(tem)
                                }
                                setRdy(true)
                            }else{
                                if(task.isLoggedOut()){
                                    navigate('/login')
                                    return
                                }
                                setError(true)
                            }
                        })
                    }else{
                        if(task.isLoggedOut()){
                            navigate('/login')
                            return
                        }
                        setError(true)
                    }
                })
            }else{
                if(task.isLoggedOut()){
                    navigate('/login')
                    return
                }
                setError(true)
            }
        })
    }

    
    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
      var _delay = delay || 5000
      setToastMeta({
          action: action,
          msg: msg,
          visible:true,
          invoked: Date.now()
      })
      clearTimeout(timy.timer)
      setTimy({
          timer:setTimeout(()=>{
              if(Date.now()-toastMeta.invoked > 4000){
                  setToastMeta({
                      action:2,
                      msg:"",
                      visible:false,
                      invoked: 0
                  })
              }
          },_delay)
      });
    }
    return <div className="vlc" style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            getMemInfo()
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        {rdy?<div className="vlc" style={{
            width:dimen.dsk?500:'100%'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Edit Diocese Profile" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
            <Mgin top={20} />
            <mye.BTv size={18} text="Section 1 - Basic Information" />
            <Mgin top={20} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Diocese Director" />
                <Mgin top={5} />
                <EditTextFilled hint="FullName Of Diocese Director" value={dname}  min={3} recv={(v)=>{
                    setDName(v.trim())
                }} />
            </div>
            <Mgin top={5} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Phone Number" />
                <Mgin top={5} />
                <EditTextFilled hint="08012345678" value={phn} digi noSpace min={11} max={11} recv={(v)=>{
                    setPhn(v.trim())
                }} />
            </div>
            <Mgin top={35} />
            <Btn txt="SAVE BASIC PROFILE" onClick={()=>{
                if(dname.length < 3){
                    toast('Invalid Name Input',0)
                    return;
                }
                if(!isPhoneNigOk(phn)){
                    toast('Invalid Phone Number',0)
                    return
                }
                setLoad(true)
                makeRequest.post('setDioceseBasicInfo',{
                    diocese_id:getDioceseId(),
                    name:dname,
                    phn:phn,
                    verif:'0'
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        toast('Basic Info update successful',1)
                    }else{
                        if(task.isLoggedOut()){
                            navigate('/login')
                            return
                        }
                        toast(task.getErrorMsg(),0)
                    }
                })
            }} />
            <Mgin top={40} />
            <mye.BTv size={18} text="Section 2 - General Profile" />
            <Mgin top={20} />
            <div style={{
                width:'100%',
                marginTop:15
            }}>
                <mye.Tv text="*State" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={state?.getId()||''} onChange={(e)=>{
                    const ele = mState.getStateByCode('NG',e.target.value)
                    setState(ele)
                    setLga(undefined)
                }}>
                    <option value="">Click to Choose</option>
                    {
                        mState.getStatesByCountry(nationality!.getId(),true).map((ele, index)=>{
                            return <option key={myKey+index+1000} value={ele.getId()}>{ele.getName()}</option>
                        })
                    }
                </select>
            </div>
            <div style={{
                width:'100%',
                marginTop:15,
            }}>
                <mye.Tv text="*Local Government Area" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={lga?.getId()||''} onChange={(e)=>{
                    if(nationality && state){
                        const ele = mLga.getLgaByCode(nationality!.getId(),state!.getId(),e.target.value)
                        setLga(ele)
                    }
                }}>
                    <option value="">Click to Choose</option>
                    {
                        (nationality&& state)?mLga.getLgasByState(nationality!.getId(),state!.getId(),true).map((ele, index)=>{
                            return <option key={myKey+index+100} value={ele.getId()}>{ele.getName()}</option>
                        }):<option value="option1">Choose Country & State First</option>
                    }
                </select>
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Official Address" />
                <Mgin top={5} />
                <EditTextFilled hint="Residential Address" value={addr} min={3} recv={(v)=>{
                    setAddr(v.trim())
                }} />
            </div>
            <Mgin top={35} />
            <Btn txt="SAVE GENERAL PROFILE" onClick={()=>{
                if(!state){
                    toast('Invalid State Input',0)
                    return
                }
                if(!lga){
                    toast('Invalid LGA/City Input',0)
                    return
                }
                if(addr.length < 3){
                    toast('Invalid Address Input',0)
                    return;
                }
                setLoad(true)
                makeRequest.post('setDioceseGeneralInfo',{
                    diocese_id:getDioceseId(),
                    state:state.getId(),
                    lga:lga.getId(),
                    addr:addr,
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        toast('General Info update successful',1)
                    }else{
                        if(task.isLoggedOut()){
                            navigate('/login')
                            return
                        }
                        toast(task.getErrorMsg(),0)
                    }
                })
            }} />
            <Mgin top={40} />
            <mye.BTv size={18} text="Section 3 - Education Secretaries" />
            <Mgin top={20} />
            {
                secretaries.map((sc, i)=>{
                    return <div key={myKey+i+0.021}>
                        <Mgin top={20} />
                        <SecretaryProfile ele={sc.ele} />
                    </div>
                })
            }
            
            <PoweredBySSS />
        </div>:LoadLay()}
    </div>

}


class secLayMan{
    layId:string
    ele?:dioceseSecretaryInfo
    constructor(layId:string, ele?:dioceseSecretaryInfo){
        this.layId = layId
        this.ele = ele
    }
}


