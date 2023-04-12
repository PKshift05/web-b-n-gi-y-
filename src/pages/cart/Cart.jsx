
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import CartProduct from './CartProduct';

const Cart = () => {
  const [loading, setLoading] = useState(false)
  const [cartProducts, setCartProducts] = useState([])
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

  const getCartProducts = async () => {
    // setLoading(true)
    const productsRef = query(collection(db, "cartProducts"), where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allCartProducts = querySnapshot.docs.map((doc) => {
        return {
          idCartProduct: doc.id,
          ...doc.data()
        }
      })

      //
      const result = Object.values(allCartProducts.reduce((accumulator, current) => {
        if (!accumulator[current.id]) {
          accumulator[current.id] = { ...current, quantity: 0 };
        }
        accumulator[current.id].quantity += 1;
        return accumulator;
      }, {}));
      setCartProducts(result)
      // setLoading(false)
    }
    catch (e) {
      console.log(e.message);
    }
  }


  const deliveryDate = () => {
    const today = new Date()
    const startDelivary = new Date()
    const endDelivary = new Date()
    startDelivary.setDate(today.getDate() + 2)
    endDelivary.setDate(today.getDate() + 5)

    //tháng bắt đầu từ 0 nên phải +1
    return (
      `${startDelivary.getDate()} Th${startDelivary.getMonth() + 1 < 10 ? `0${startDelivary.getMonth() + 1}` : startDelivary.getMonth() + 1} - ${endDelivary.getDate()} Th${endDelivary.getMonth() + 1 < 10 ? `0${endDelivary.getMonth() + 1}` : endDelivary.getMonth() + 1}`
    )
  }

  useEffect(() => {
    getCartProducts()
  }, [])

  return (
    <>
      <div className="w-full py-[30px]">
        <div className="max-w-[1230px] mx-auto ">
          <div className="w-full px-[15px] pb-[30px]">
            <div className="w-full flex">
              {/* left */}
              <div className="basis-[58.33%] pr-[30px] border border-transparent border-r-[#ececec]">
                <table className='w-full'>
                  <thead>
                    <tr className='border-[3px] border-transparent border-b-[#ececec] grid gap-5 grid-cols-12 grid-rows-1 text-[14px] font-bold py-2 uppercase tracking-wider'>
                      <td className='col-span-6'>Sản phẩm</td>
                      <td className='col-span-2'>Giá</td>
                      <td className='col-span-2'>Số lượng</td>
                      <td className='col-span-2'>Tổng</td>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((cartProduct) => (
                      <CartProduct
                        key={cartProduct.idCartProduct}
                        idProduct={cartProduct.id}
                        name={cartProduct.name}
                        img={cartProduct.imgURL}
                        price={cartProduct.price}
                        quantityProduct={cartProduct.quantity}
                      />
                    ))}
                  </tbody>
                </table>
                <div className="mt-6">
                  <NavLink
                    to='/'
                    className='border-[2px] border-primary text-primary px-4 py-2 hover:bg-primary hover:text-white font-medium transition-all ease-linear duration-[120ms]'>
                    <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                    <span className='text-[14] uppercase'>Tiếp tục xem sản phẩm</span>
                  </NavLink>
                </div>
              </div>
              {/* right */}
              <div className="flex-1 pl-[30px]">
                <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[14px] font-bold py-2 uppercase tracking-wider">
                  <h1 className=''>Tổng thanh toán</h1>
                </div>
                <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                  <h2 className=''>Tổng phụ</h2>
                  <h2 className='font-bold'>2.920.000 ₫</h2>
                </div>
                <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                  <h2 className=''>Giao hàng</h2>
                  <div className="">
                    {/* lấy 1% giá trị hàng */}
                    <p>Phí giao hàng toàn quốc: <span className='font-bold'>30.000 ₫</span></p>
                    <p className=''>Nhận hàng vào <span className='font-bold'>{deliveryDate()}</span></p>
                  </div>
                </div>
                <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-4 text-[14px]'>
                  <h2 className=''>Tổng thanh toán</h2>
                  <h2 className='font-bold'>2.950.000 ₫</h2>
                </div>
                <div className='mt-6 text-[14px]'>
                  <button
                    // onClick={}
                    className='w-full px-2 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Tiến hành thanh toán</button>
                  <div className="pt-6 pb-3 flex gap-2 border-[2px] border-transparent border-b-[#ddd]">
                    <FontAwesomeIcon
                      className='text-[#b0b0b0] text-[20px]'
                      icon={faTags}
                      rotation={90} />
                    <p className='font-bold text-[16px]'>Phiếu ưu đãi</p>
                  </div>
                  <input
                    className='my-5 text-[16px] w-full px-3 py-2 outline-none border border-[#ccc] focus:shadow-shadowPink'
                    placeholder='Mã ưu đãi'
                    type="text" name="" id="" />
                  <button
                    // onClick={}
                    className='w-full p-2 border border-[#ccc] bg-[#f9f9f9] hover:bg-[#c7c7c7] flex items-center justify-center -tracking-tighter text-[16px] text-[#666] transition-all ease-in-out duration-100'>Áp dụng</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Cart;