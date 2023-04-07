import React, { memo, useState } from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//firebase
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { auth } from '../../firebase/config';
import { Spinning } from '../../animation-loading';


const SignUp = ({ signUp, setSignUp, signInWithGoogle }) => {
  const [loading, setLoading] = useState(false);
  const [regInfo, setRegInfo] = useState({
    email: "",
    password: "",
    Cpassword: "",
  })
  //viết regex check Username phải dài từ 3 đến 16 ký tự và chỉ chứa các ký tự chữ và khoảng trắng, chứa cả tiếng việt, kết quả trả về chỉ chứa đoạn regex, không chứa bất cứ cái gì khác (tôi dùng ES6) /^[\p{L} ]{3,16}$/u
  //viết regex kiểm tra Password phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt, kết quả trả về chỉ chứa đoạn rege, không chứa bất cứ cái gì khác
  const checkInvalidUser = () => {
    if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(regInfo.email)) {
      return {
        notify: "Hãy nhập đúng định dạng email",
        status: false,
      };
    }

    if (!(/^[a-zA-Z0-9]{8,}$/).test(regInfo.password)) {
      return {
        notify: "Mật khẩu phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
        status: false,
      };
    }

    if (regInfo.password != regInfo.Cpassword) {
      return {
        notify: "Mật khẩu mới không chính xác",
        status: false,
      };
    }

    //
    return {
      notify: "Đăng ký tài khoản thành công",
      status: true,
    };
  }

  const handleInput = (e) => {
    setRegInfo({
      ...regInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignUp = (e) => {
    e.preventDefault();

    const { notify, status } = checkInvalidUser();
    if (!status) {
      toast.error(notify, {
        autoClose: 1500,
      });
    }
    //neu status la true, tuc la input hop le het thi cho phep dang ky
    // !loading la chi khi nao quay xong cai spinnig (dang ky xong) thi moi dc phep nhan vao button dang ky tiep
    //TỰ ĐỘNG ĐĂNG NHẬP SAU KHI TẠO XONG TÀI KHOẢN
    else if (status && !loading) {
      // console.log('createUserWithEmailAndPassword');
      handleInput(e);
      setLoading(true)
      createUserWithEmailAndPassword(auth, regInfo.email, regInfo.password)
        .then((userCredential) => {
          const user = userCredential.user;
          localStorage.setItem('imgAvatar', user.photoURL);
          setLoading(false);
          toast.success(notify, {
            autoClose: 1200,
          });
          setSignUp(false)
        })
        .catch((e) => {
          setLoading(false);
          toast.error('Tài khoản đã tồn tại', {
            autoClose: 1200,
          });
        });
    };
  }

  return (
    <>
      <div className={`absolute top-0 transition-all duration-[0.6s] ease-in-out w-1/2 h-full left-0 opacity-0 z-[1] ${signUp ? " translate-x-[100%] opacity-100 z-[5] animate-showSignUp" : ""}`}>
        <form onSubmit={handleSignUp} className='bg-white flex justify-center flex-col px-[50px] h-full text-center'>
          <h1 className="font-bold m-0 text-[30px]">Tạo tài khoản</h1>
          <NavLink
            onClick={signInWithGoogle}
            className="w-full my-3 flex text-white gap-[15px] items-center justify-center cursor-pointer bg-[#dd4b39]">
            <span className="no-underline flex h-[40px] text-[18px] items-center justify-center" href="#" >
              <FontAwesomeIcon className='icon' icon={faGoogle} />
            </span>
            <p>Continue with Google</p>
          </NavLink>
          <span className='text-[13px] mb-3  flex items-center'>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
            <p className='mx-[5px]'>Hoặc tạo tài khoản bằng email</p>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
          </span>
          <input
            name="email"
            className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="text" placeholder="Email"
            onChange={handleInput} />
          <input
            name="password"
            className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="password" placeholder="Password"
            onChange={handleInput} />
          <input
            name="Cpassword"
            className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="password" placeholder="Nhập lại Password"
            onChange={handleInput} />
          <button
            type="submit"
            className='mt-[10px] disabled:bg-blue-400 bg-primary text-white text-[13px] leading-5 font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>
            {loading ? <Spinning /> : "Đăng ký"}
          </button>
        </form>
      </div>
    </>
  );
};

export default memo(SignUp);