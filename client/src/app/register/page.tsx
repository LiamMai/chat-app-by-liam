'use client'
import { useState, useEffect, useRef } from 'react'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL!;
    console.log('baseURL', baseURL)
  }, [])

  return (
    <div className='bg-white h-screen flex items-center justify-center p-5'>
      <section className=''>
        <main className='w-full'>
          <article className='flex items-center justify-center w-full'>
            <div className='flex flex-col grow justify-center mt-[12px] h-login-banner'>
              <div className='flex flex-col items-center border border-solid border-slate-300 max-w-[363px] p-10 rounded h-5/6'>
                <div className='bg-logo bg-contain bg-no-repeat w-[200px] min-h-[80px]'></div>
                <h2 className='text-center text-md text-ig-secondary-text font-semibold mb-5'>Sign up to see photos and videos from your friends.</h2>
                <div className='flex mb-2 w-full'>
                  <button className='flex items-center justify-center w-full bg-ig-primary-button rounded px-[16px] py-[7px] hover:bg-ig-primary-button-hover'>
                    <div className='bg-logo-face bg-contain bg-no-repeat w-[16px] h-[16px] mr-[8px] text-white'></div>
                    <span className='text-white font-semibold'>Log in with Facebook</span>
                  </button>
                </div>

                <div className='flex mb-3'>
                  <div className='h-[1px] bg-ig-separator block w-[107px] mt-[26px]'></div>
                  <div className='uppercase mx-[18px] font-semibold flex items-center text-stone-400 mt-[16px]'>OR</div>
                  <div className='h-[1px] bg-ig-separator block w-[107px] mt-[26px]'></div>
                </div>


                <form action="" method='post'>
                  <div>
                    <input type='text' aria-label="Fullname" aria-required='true' className='form-input bg-ig-secondary-background border border-ig-stroke rounded' placeholder='Fullname' name='name' />
                  </div>

                  <div className='mt-3'>
                    <input type='email' aria-label="Email" aria-required='true' className='form-input bg-ig-secondary-background border border-ig-stroke rounded' placeholder='Email' name='email' />
                  </div>

                  <div className='mt-3'>
                    <input type='password' aria-label="Password" aria-required='true' className='form-input bg-ig-secondary-background border border-ig-stroke rounded' placeholder='Password' name='password' />
                  </div>

                  <button type='submit' className='btn-primary bg-ig-primary-button w-full text-white font-bold' disabled={email ? true : false || password ? true : false}>Sign up</button>

                </form>
              </div>

              <div className='flex flex-col justify-center border border-solid border-slate-300 h-1/6 rounded max-w-[363px] mt-[16px]'>
                <p className='flex justify-center items-center'>
                  Already have an account?
                  <a href='/login' className='text-blue-600 ml-[2px] font-bold'>Login</a>
                </p>
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