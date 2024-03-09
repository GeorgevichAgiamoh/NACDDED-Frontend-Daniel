import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../../../helper/dimension";
import { Btn, BtnIcn, ErrorCont, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../helper/general";
import { AdminNav, InDev, MemberNav } from "../nav";
import { Add, Announcement, ArrowDropDown, ArrowRightAltRounded, ArrowRightOutlined, ArrowRightRounded, AttachFile, BuildOutlined, Close, DeveloperModeOutlined, LockOutlined, Mail, Menu, NotificationImportant, NotificationsActive, NotificationsActiveOutlined, PersonOutline, PieChart, SavingsOutlined, VolumeUpOutlined } from "@mui/icons-material";
import { annEle } from "../../classes/classes";
import { endpoint, getDioceseId, getSecretaryEmail, makeRequest, saveDioceseId } from "../../../helper/requesthandler";
import { useNavigate } from "react-router-dom";
import { dioceseBasicinfo, dioceseGeneralinfo, dioceseSecretaryInfo } from "../../classes/models";
import { CircularProgress } from "@mui/material";
import Toast from "../../toast/toast";
import { CompleteProfile } from "../completeprofile";
import { MemberDashboard } from "./dashbrd";
import { Events } from "./events/events";
import { DioceseMessages } from "./messges/messages";


export function Members(){
    const[myKey, setMyKey] = useState(Date.now())
    const mye = new myEles(false);
    const navigate = useNavigate()
    const dimen = useWindowDimensions();
    const[showNav, setShowNav] = useState(false)
    const[tabPos, setTabPos] = useState(0)
    const[me, setMe] = useState<dioceseSecretaryInfo>()
    const[mbi, setMBI] = useState<dioceseBasicinfo>()
    const[mgi, setMGI] = useState<dioceseGeneralinfo>()
    const[yearsOwing, setYearsOwing] = useState<string[]>([])
    const[ppic,setPpic] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const tabs = [
        'Dashboard',
        'Events and Conferences',
        'Payments',
        'Messages',
        'User Profile',
        'Schools',
        'Logout'
    ]

    useEffect(()=>{
        makeRequest.get('checkTokenValidity',{},(task)=>{
          if(task.isSuccessful()){
            //OK
            getDioceseInfo()
          }else{
            navigate('/login')
          }
        })
    },[])


    function getDioceseInfo(){
        //First, get the secretary Info,
        
        makeRequest.get(`getSecretaryInfo`,{email: getSecretaryEmail()},(task)=>{
            if(task.isSuccessful()){
                const msi = new dioceseSecretaryInfo(task.getData())
                saveDioceseId(msi.getDioceseID())
                setMe(msi)
                makeRequest.get(`getDioceseBasicInfo/${getDioceseId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        const mb = new dioceseBasicinfo(task.getData())
                        setMBI(mb)
                        makeRequest.get(`getDioceseGeneralInfo/${getDioceseId()}`,{},(task)=>{
                            if(task.isSuccessful()){
                                if(task.exists()){
                                    setMGI(new dioceseGeneralinfo(task.getData()))
                                }
                            }else{
                                setError(true)
                            }
                        })
                    }else{
                        setError(true)
                    }
                })
                //Profile pic
                makeRequest.get(`fileExists/dp/${getDioceseId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        setPpic(`${endpoint}/getFile/dp/${getDioceseId()}`)
                    }
                })
                confirmYearOwing(new Date().getFullYear().toString())
                //TODO auto do for other years
            }else{
                setError(true)
            }
        })
        //Dont do anything until diocese ID has been saved to localstorage
    }

    function updateYearsOwed(ny:string){
        const oyo:string[] =  [...yearsOwing]
        oyo.push(ny)
        setYearsOwing(oyo)
    }

    function confirmYearOwing(year:string){
        makeRequest.get(`getMemDuesByYear/${getDioceseId()}/${year}`,{},(task)=>{
            if(task.isSuccessful()){
                if(!task.exists()){
                    updateYearsOwed(year)
                }
            }else{
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

    return <div style={{
        width: dimen.width,
        height: dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getDioceseInfo()
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
        <div key={myKey} style={{
            width:'100%',
            height:'100%',
            display:'flex'
        }}>
            <div style={{
                width:250,
                height:'100%',
                display: dimen.dsk?undefined:'none'
            }}>
                <MemberNav  key={myKey+0.2} currentTab={tabPos} mye={mye} isMobile={!dimen.dsk} ocl={(pos)=>{
                    setTabPos(pos)
                    if(pos==6){
                        makeRequest.get('logout',{},(task)=>{
                            navigate('/login')
                        })
                    }
                }} showy={()=>{

                }}  />
            </div>
            <div style={{
                flex:1,
                display:'flex',
                flexDirection:'column',
                height:'100%',
            }}>
                <div style={{
                    width:'100%',
                    padding:'10px 20px',
                    boxSizing:'border-box',
                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.06), 0 2px 5px rgba(0, 0,0,0.1)'
                }}>
                    <LrText
                        left={<div className="hlc">
                            <div style={{
                                display: dimen.dsk?'none':undefined,
                                padding:5,
                                marginRight:10
                            }} onClick={()=>{
                                setShowNav(true)
                            }}>
                                <Menu />
                            </div>
                            <mye.HTv text={tabs[tabPos]} size={16} color={mye.mycol.primarycol} />
                        </div>}
                        right={<div className="hlc">
                            <NotificationsActiveOutlined className="icon" />
                            <Mgin right={15}/>
                            <div style={{
                                width:1,
                                height:20,
                                backgroundColor:mye.mycol.primarycol
                            }}></div>
                            <Mgin right={15}/>
                            <div id="clk" onClick={()=>{
                                    fileInputRef.current?.click()
                                }}>
                                    <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e)=>{
                                        const file = e.target.files?.[0];
                                        if(file){
                                            setLoad(true)
                                            makeRequest.uploadFile('dp',getDioceseId(),getDioceseId(),file, (task)=>{
                                                setLoad(false)
                                                if(task.isSuccessful()){
                                                    toast('Profile picture set',1)
                                                    setTimeout(()=>{
                                                        setPpic(`${endpoint}/getFile/dp/${getDioceseId()}`)
                                                    },2000)
                                                }else{
                                                    if(task.isLoggedOut()){
                                                        navigate('/login')
                                                        return
                                                    }
                                                    toast(task.getErrorMsg(),0)
                                                }
                                            })
                                        }else{
                                            toast('Invalid File. Try again',0)
                                        }
                                    }}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                {ppic.length==0?<div  className="ctr" style={{
                                    width:42,
                                    height:42,
                                    backgroundColor:mye.mycol.btnstrip,
                                    borderRadius:50
                                }} >
                                    <Add className="icon" />
                                </div>:<img src={ppic} alt="DP" style={{
                                    objectFit:'cover',
                                    width:42,
                                    height:42,
                                    backgroundColor:mye.mycol.btnstrip,
                                    borderRadius:50
                                }}  />}
                            </div>
                            <Mgin right={5}/>
                            <ArrowDropDown className="icon" />
                        </div>}
                        />
                </div>
                <div style={{
                    flex:1,
                    width:'100%',
                    overflowY:'scroll',
                    backgroundColor:'rgba(0,0,0,0.02)'
                }}>
                    {mbi?tabPos===0?<MemberDashboard goto={(a)=>{
                        setTabPos(a)
                        setMyKey(Date.now())
                    }} yearsOwed={yearsOwing} mbi={mbi!} mgi={mgi}/>:tabPos==1?<Events msi={me!} mgi={mgi} mbi={mbi} />:tabPos==3?<DioceseMessages dbi={mbi} />:tabPos==4?<CompleteProfile />:tabPos==6?LoadLay():<InDev availables="Dashboard, Events & Conference User profile, and logout" />:LoadLay()}
                </div>
            </div>
        </div>
        <div style={{
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            display: (!dimen.dsk && showNav) ? undefined:'none'
        }}>
            <MemberNav key={myKey+0.3} currentTab={tabPos} mye={mye} isMobile={!dimen.dsk} ocl={(pos)=>{
                setShowNav(false)
                setTabPos(pos)
                if(pos==6){
                    makeRequest.get('logout',{},(task)=>{
                        navigate('/login')
                    })
                }
            }} showy={()=>{
                setShowNav(false)
            }}  />
        </div>
    </div>

    function AskToVerif() {
        return <div className="ctr" style={{
            width:'100%',
            height:'100%'
        }}>
            <div className="vlc">
                <PersonOutline style={{
                    fontSize:30,
                    color:mye.mycol.primarycol
                }} />
                <Mgin top={20} />
                <mye.HTv text={mgi?"Pending Verification":'Complete Profile'} />
                <Mgin top={10} />
                <mye.Tv text={mgi?'Your profile is pending verification by the admin. Please check back later':'Please click button below to complete your profile'} />
                <div style={{
                    display:mgi?'none':undefined
                }}>
                    <Mgin top={10} />
                    <Btn txt="COMPLETE PROFILE" width={150} onClick={()=>{
                        setTabPos(3)
                        setMyKey(Date.now())
                    }} />
                </div>
            </div>
        </div>
    }

    function ShowProfileDeleted() {
        return <div className="ctr" style={{
            width:'100%',
            height:'100%'
        }}>
            <div className="vlc">
                <LockOutlined style={{
                    fontSize:30,
                    color:mye.mycol.primarycol
                }} />
                <Mgin top={20} />
                <mye.HTv text={'Profile Deleted'} />
                <Mgin top={10} />
                <mye.Tv text={'Your profile has been deleted by the admin. Please reach out to NACDDED HQ to resolve'} center />
            </div>
        </div>
    }


}


export function MsgTBD() {
    const mye = new myEles(false)
    
    return <div className="ctr" style={{
        width:'100%',
        height:'100%'
    }}>
        <div className="vlc">
            <DeveloperModeOutlined style={{
                fontSize:30,
                color:mye.mycol.primarycol
            }} />
            <Mgin top={20} />
            <mye.HTv text={'Coming Soon'} />
            <Mgin top={10} />
            <mye.Tv text={'Messaging is coming soon'} />
        </div>
    </div>
}
