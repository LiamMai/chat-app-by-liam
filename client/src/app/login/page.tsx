'use client'
import { THEME_CONSTANTS } from '@/constants'
import Image, { StaticImageData } from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { BannerArr } from "../../assets/images"

const Login = () => {
  const [banner, setBanner] = useState(BannerArr[0])
  const indexBanner = useRef(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexBanner.current === BannerArr.length - 1) {
        indexBanner.current = 0;
      }

      indexBanner.current++;

      setBanner(BannerArr[indexBanner.current]);

    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [JSON.stringify(banner)])

  return (
    <div className='bg-white h-screen flex items-center justify-center p-5'>
      <section className=''>
        <main className='w-full'>
          <article className='flex items-center justify-center w-full'>
            <div className="grid grid-cols-2 gap-4">
              <div className='bg-home-phone h-login-banner w-[500px] relative'>
                <Image src={banner} alt='Banner' className='bg-no-repeat absolute top-[25px] left-[154px] transition-all animation-fade-out' />
              </div>

              <div className='flex flex-col grow justify-center mt-[12px] h-login-banner'>
                <div className='flex flex-col items-center border border-solid border-slate-300 max-w-[350px] p-10 rounded h-5/6'>
                  <div className='bg-logo bg-contain bg-no-repeat w-[200px] h-[80px]'></div>
                  <form action="" method='post'>
                    <div>
                      <input type='text' aria-label="Email" aria-required='true' className='form-input bg-ig-secondary-background border border-ig-stroke rounded' placeholder='Email' name='email' />
                    </div>

                    <div className='mt-3'>
                      <input type='password' aria-label="Password" aria-required='true' className='form-input bg-ig-secondary-background border border-ig-stroke rounded' placeholder='Password' name='password' />
                    </div>

                    <button type='submit' className='btn-primary bg-ig-primary-button w-full text-white font-bold' disabled={email ? true : false || password ? true : false}>Log in</button>

                    <div className='flex'>
                      <div className='h-[1px] bg-ig-separator block w-[107px] mt-[26px]'></div>
                      <div className='uppercase mx-[18px] font-semibold flex items-center text-stone-400 mt-[16px]'>OR</div>
                      <div className='h-[1px] bg-ig-separator block w-[107px] mt-[26px]'></div>
                    </div>

                    <div className='flex mt-[26px]'>
                      <button className='flex items-center justify-center w-full'>
                        <div className='bg-logo-face bg-contain bg-no-repeat w-[16px] h-[16px] mr-[8px]'></div>
                        <span className='text-[#385185] font-semibold'>Log in with Facebook</span>
                      </button>
                    </div>

                    <a href='/password/forgot' className='flex justify-center text-blue-500 mt-[26px]'>Forgot password?</a>
                  </form>
                </div>

                <div className='flex flex-col justify-center border border-solid border-slate-300 h-1/6 rounded max-w-[350px] mt-[16px]'>
                  <p className='flex justify-center items-center'>
                    Don't have an account? 
                    <a href='/register' className='text-blue-600 ml-[2px] font-bold'>Sign up</a>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>

        <footer></footer>
      </section>
    </div>
  )
}

export default Login