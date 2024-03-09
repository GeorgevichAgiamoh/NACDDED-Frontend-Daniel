import { useEffect, useState } from "react"
import { Btn, ErrorCont, Line, Mgin, appName, goUrl, myEles, setTitle } from "../../../../helper/general"
import useWindowDimensions from "../../../../helper/dimension"
import { ArrowBack, FileOpenOutlined, PersonOutline } from "@mui/icons-material"
import { defVal, dioceseBasicinfo, fileEle, getCreatedTime } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { endpoint, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/nacdded"


export function AdminDirView(mainprop:{user:dioceseBasicinfo,backy:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const [mykey,setMyKey] = useState(Date.now())
    const[memFiles,setMemfiles] = useState<fileEle[]>([])

    useEffect(()=>{
        setTitle(`Member Details - ${appName}`)
        getMemFiles()
    },[])

    function getMemFiles(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getFiles/${mainprop.user.getDioceseID()}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:fileEle[] = []
                for(const key in task.getData()){
                    tem.push(new fileEle(task.getData()[key]))
                }
                setMemfiles(tem)
            }else{
                handleError(task)
            }
        })
    }

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
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

    function updateData(key:string, value:string, mailUser?:boolean){
        setLoad(true)
        const ndata = {...mainprop.user.data}
        ndata[key] = value
        makeRequest.post('setDioceseBasicInfo',ndata,(task)=>{
            if(task.isSuccessful()){
                mainprop.user.data[key] = value
                setLoad(false)
                toast('Update successful',1)
                setMyKey(Date.now()) // Rebuild entire page
            }else{
                handleError(task)
            }
        })
    }

    return <div key={mykey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getMemFiles()
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
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy(-1)
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div className="hlc">
            <PersonOutline style={{
                fontSize:20,
                color:mye.mycol.secondarycol
            }} />
            <Mgin right={10} />
            <mye.HTv size={14} text="Personal Information" color={mye.mycol.secondarycol} />
        </div>
        <Mgin top={20} />
        <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            boxSizing:'border-box',
            padding:dimen.dsk?20:10
        }}>
            {!mainprop.user.isVerified()?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="APPROVE" onClick={()=>{
                    updateData('verif','1',true)
                }} width={120} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/> 
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    updateData('verif','2')
                }} width={120} outlined/>*/}
            </div>:<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="DEACTIVATE" onClick={()=>{
                    updateData('verif','0')
                }} width={120} bkg={mye.mycol.red} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/>
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    updateData('verif','2')
                }} width={120} outlined/> */}
            </div>}
            <Mgin top={20} />
            <div style={{
                width:'100%',
                display:dimen.dsk?'flex':undefined,
                alignItems:'center'
            }}>
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    <InfoLay sub="Diocese ID" main={mainprop.user.getDioceseID()} />
                    <InfoLay sub="Director" main={mainprop.user.getName()} />
                    <InfoLay sub="Phone" main={mainprop.user.getPhone()} />
                    <InfoLay sub="State" main={mainprop.user.generalData.getFormattedState()} />
                    <InfoLay sub="City" main={mainprop.user.generalData.getFormattedLGA()} />
                    <InfoLay sub="Address" main={mainprop.user.generalData.getAddr()} />
                </div>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <Line vertical={dimen.dsk} col={mye.mycol.btnstrip} height={200}/>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    
                    <div style={{
                        width:'100%',
                        margin:'10px 0px'
                    }}>
                        <Mgin top={20} />
                        <mye.HTv text="Secretary" size={18} />
                    </div>
                    
                    <InfoLay sub="First Name" main={mainprop.user.secretaries[0].getFirstName()} />
                    <InfoLay sub="Middle Name" main={mainprop.user.secretaries[0].getMiddleName()} />
                    <InfoLay sub="Last Name" main={mainprop.user.secretaries[0].getLastName()} />
                    <InfoLay sub="Gender" main={mainprop.user.secretaries[0].getFormattedGender()} />
                    <InfoLay sub="Phone" main={mainprop.user.secretaries[0].getPhone()} />
                    <InfoLay sub="Address" main={mainprop.user.secretaries[0].getAddr()} />
                    <InfoLay sub="Email" main={mainprop.user.secretaries[0].getEmail()} />
                    <div style={{
                        width:'100%',
                        marginTop:20,
                        marginRight:10
                    }}>
                        <mye.Tv text={'Uploaded Documents'} color={mye.mycol.imghint} size={12} />
                        <Mgin top={5} />
                        {
                            memFiles.map((mf, index)=>{
                                return <div key={mykey+index+0.34} style={{
                                    marginBottom:5
                                }} className="hlc">
                                    <FileOpenOutlined style={{
                                        fontSize:20,
                                        color:mye.mycol.secondarycol
                                    }} />
                                    <Mgin right={5} />
                                    <mye.Tv text={mf.getFolder()+'/'+mf.getName()} size={14} onClick={()=>{
                                        goUrl(`${endpoint}/getFile/${mf.getFolder()}/${mf.getName()}`)
                                    }} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
        <PoweredBySSS floaatIt />
    </div>

    function InfoLay(prop:{sub:string, main:string}) {
        return <div style={{
            minWidth:dimen.dsk?120:100,
            marginTop:dimen.dsk?20:20,
            marginRight:10
        }}>
            <mye.Tv text={prop.sub} color={mye.mycol.imghint} size={12} />
            <Mgin top={5} />
            <mye.Tv text={prop.main} size={16} />
        </div>
    }

}