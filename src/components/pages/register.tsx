import { useEffect, useRef, useState } from "react";
import { InfoOutlined } from "@mui/icons-material";
import coin from '../../assets/coin.png'
import thumb from '../../assets/thumbs.png'
import { MsgAlert, PaystackExplanation, PoweredBySSS } from "../../helper/nacdded";
import useWindowDimensions from "../../helper/dimension";
import { myEles, setTitle, appName, Mgin, EditTextFilled, Btn, } from "../../helper/general";


/*
export function Register(){
    const qry = useQuery();
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[fname,setFName] = useState('')
    const[mname,setMName] = useState('')
    const[lname,setLName] = useState('')
    const[eml,setEml] = useState('')
    const[phn,setPhn] = useState('')
    const[pwd1,setPwd1] = useState('')
    const[pwd2,setPwd2] = useState('')
    const[memid,setMemid] = useState(qry.get('mid') ?? '')

    useEffect(()=>{
        setTitle(`Create Account - ${appName}`)
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
    return <div className="vlc" style={{
        width:dimen.width,
        height:dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{

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
        <div className="vlc" style={{
            width:dimen.dsk?500:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Create an Account" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
            <Mgin top={20} />
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
                    <mye.Tv text="Middle Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Middle Name" value={mname} noSpace min={0} recv={(v)=>{
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
            <Mgin top={5} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Email Address" />
                <Mgin top={5} />
                <EditTextFilled hint="Enter Email Address" value={eml} noSpace min={0} recv={(v)=>{
                    setEml(v.trim())
                }} />
            </div>
            <Mgin top={5} />
            <mye.Tv text="For Verification purposes, please use official cooperative email address" color={mye.mycol.hint} size={12} />
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Phone Number" />
                <Mgin top={5} />
                <EditTextFilled hint="08012345678" value={phn} digi noSpace min={5} max={20} recv={(v)=>{
                    setPhn(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd1} min={6} pwd recv={(v)=>{
                    setPwd1(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Confirm Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd2} min={6} pwd recv={(v)=>{
                    setPwd2(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*ADSI Number" />
                <Mgin top={5} />
                <EditTextFilled hint="ADSI Number" value={memid} min={1} max={8}digi recv={(v)=>{
                    setMemid(v.trim())
                }} />
            </div>
            <Mgin top={20} />
            
            <Mgin top={15} />
            <Btn txt="CREATE ACCOUNT" onClick={()=>{
                if(fname.length < 3){
                    toast('Invalid First Name Input',0)
                    return;
                }
                if(lname.length < 3){
                    toast('Invalid Last Name Input',0)
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
                if(pwd1.length < 6){
                    toast('Invalid Password',0)
                    return
                }
                if(pwd1 != pwd2){
                    toast('password mismatch',0)
                    return
                }
                if(memid.length == 0){
                    toast('Enter ADSI Number',0)
                    return
                }
                
                setLoad(true)
                const fMemId = formatMemId(memid)
                makeRequest.post('register',{
                    memid:fMemId,
                    email:eml,
                    password:pwd1
                },(task)=>{
                    if(task.isSuccessful()){
                        //Set Basic Data
                        makeRequest.post('setDioceseBasicInfo',{
                            memid:fMemId,
                            fname:fname,
                            lname:lname,
                            mname:mname,
                            eml:eml,
                            phn:phn,
                            verif:'0',
                            pay:'1'
                        },(task)=>{
                            saveMemId(fMemId)
                            makeRequest.get('logout',{},(task)=>{
                                setLoad(false)
                                navigate('/login')
                            })
                        })
                    }else{
                        setLoad(false)
                        toast(task.getErrorMsg()+' Maybe login instead',0)
                    }
                },true)
            }} />
            <Mgin top={20} />
            <div className="hlc">
                <mye.Tv text="Already have an account?" color={mye.mycol.primarycol} />
                <Mgin right={10} />
                <mye.Tv text="Sign In" color={mye.mycol.primarycol} onClick={()=>{
                    navigate(`/login?mid=${memid}`)
                }} />
            </div>
            <PoweredBySSS/>
        </div>
    </div>

}
*/


export function MakePayment(){
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[shares,setShares] = useState('')
    const[amt, setAmt] = useState('')
    const[paySuccess, setPaySuccess] = useState(false)

    useEffect(()=>{
        setTitle(`Make Payment - ${appName}`)
    },[])

    return <div className="ctr" style={{
        width:dimen.width,
        height:dimen.height
    }}>
        {paySuccess?<div className="vlc" style={{
            width:dimen.dsk?300:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <img src={thumb} alt="Payments" height={100} />
            <Mgin top={30} />
            <mye.BTv text="Payment Successful" size={22} />
            <Mgin top={30} />
            <Btn txt="PROCEED TO DASHBOARD" onClick={()=>{

            }} />
            </div>:
        <div className="vlc" style={{
            width:dimen.dsk?500:dimen.width,
            padding:dimen.dsk?0:10,
            boxSizing:'border-box'
        }}>
            <img src={coin} alt="Payments" height={100} />
            <Mgin top={30}/>
            <mye.HTv text="You are required to pay the following"  />
            <Mgin top={10}/>
            <mye.Tv text="1. Membership Registration: N5000 (One-time payment)" />
            <Mgin top={5} />
            <mye.Tv text="2. Thrift (annual Dues): N1000 monthly (N12,000 paid annually)" />
            <Mgin top={5} />
            <mye.Tv text="3. Share Capital: Minimum of 1000 shares @ N10 per share" />
            <Mgin top={20} />
            <div className="hlc" style={{
                width:'100%'
            }}>
                <div style={{
                    flex:1
                }}>
                    <mye.Tv text="*Shares" />
                    <Mgin top={5} />
                    <EditTextFilled hint="1000" value={shares} noSpace digi recv={(v)=>{
                        setShares(v)
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="*Amount To Pay" />
                    <Mgin top={5} />
                    <div style={{
                        width:'100%',
                        boxSizing:'border-box',
                        padding:'15px 20px',
                        backgroundColor: mye.mycol.btnstrip,
                        borderRadius:10
                    }}>
                        <mye.Tv  text={amt.length!==0?amt:"Auto Calculated"} size={16} color={mye.mycol.hint}/>
                    </div>
                </div>
            </div>,
            <Mgin top={35} />
            <Btn txt="PAY" onClick={()=>{
                setPaySuccess(true)
            }} />
        </div>}
    </div>

}


/*
export function PayRegFee(){
    const navigate = useNavigate()
    const location = useLocation()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[payStage, setPayStage] = useState(0)
    const[mbi, setMBI] = useState<memberBasicinfo>() 

    useEffect(()=>{
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        setTitle(`Make Payment - ${appName}`)
        begin()
        return () => {
            document.body.removeChild(script);
          };
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function begin(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getDioceseBasicInfo/${getMemId()}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const mbi = new memberBasicinfo(task.getData());
                setPayStage(mbi.isPaid()?1:0)
                setMBI(mbi)
            }else{
                setError(true)
            }
        })
    }

    function payWithPaystack() {
        if(mbi && (window as any).PaystackPop){
            var handler = (window as any).PaystackPop.setup({

                subaccount: "ACCT_h7vjxjpgaozww2z",

                label: 'ADSI COOPERATIVE SOCIETY',
      
                key: paystackPK,
            
                email: mbi.getEmail()==defVal?mbi.getPhone()+'@adsicoop.com.ng':mbi.getEmail(),
            
                amount: 5000 * 100, //In kobo
            
                currency: 'NGN', 
            
                ref: getPayRef('0','5000',getMemId()), 
            
                callback: function(response:any) {
                  //var reference = response.reference;    
                  setPayStage(2)
                },
            
                onClose: function() {
                  toast('Transaction cancelled',0);
                },
                metadata: {
                    name: mbi.getFirstName()+' '+mbi.getlastName(),
                    time: Date.now().toString(),
                    year: '', 
                    shares: '' 
                  },
              });
              handler.openIframe();
        }else{
            toast('An error occured. Please refresh the page',0)
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

    return <div className="ctr" style={{
        width:dimen.width,
        height:dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            begin()
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
        {payStage==1?<div className="vlc" style={{
            width:dimen.dsk?300:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <img src={thumb} alt="Payments" height={100} />
            <Mgin top={30} />
            <mye.BTv text="Payment Successful" size={22} />
            <Mgin top={10}/>
            <mye.Tv text="Thank you. Your payment has been received." center />
            <Mgin top={30} />
            <Btn txt="PROCEED TO DASHBOARD" onClick={()=>{
                navigate('/')
            }} />
            </div>:payStage==2?<div className="vlc" style={{
            width:dimen.dsk?300:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <img src={thumb} alt="Payments" height={100} />
            <Mgin top={30} />
            <mye.BTv text="Processing Payment" size={22} />
            <Mgin top={10}/>
            <mye.Tv text="Thank you. Your payment is being processed. We will let you know if we need more info." center />
            <Mgin top={30} />
            <Btn txt="PROCEED TO DASHBOARD" onClick={()=>{
                navigate('/')
            }} />
            </div>:
        <div className="vlc" style={{
            width:dimen.dsk?500:dimen.width,
            padding:dimen.dsk?0:10,
            boxSizing:'border-box'
        }}>
            <img src={coin} alt="Payments" height={100} />
            <Mgin top={30}/>
            <mye.HTv text="Pay Registration Fee"  />
            <Mgin top={10}/>
            <mye.Tv text="You are required to pay a one-time registration fee of 5000 naira before you can proceed to your dashboard" center />
            <Mgin top={35} />
            <PaystackExplanation />
            <Btn txt="PAY" onClick={()=>{
                payWithPaystack()
            }} />
        </div>}
    </div>

}
*/


