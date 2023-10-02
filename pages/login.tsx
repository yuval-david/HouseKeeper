import Head from 'next/head'
import Image from 'next/image'
import style from "../styles/Login.module.css"
import { CustomInput } from "../components/UI/FormFields/CustomInput"
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ModalMessage } from '@/components/UI/Modals/ModalMessage';
import { Loader } from '@/components/UI/Loader';
import { setUserData } from '@/stores/UserStore';
import { User } from '@/Types/objects_types';

export default function Login() {

    const router = useRouter();
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const loginEndpoint = apiEndpoint + "/v2/login";

    // Form Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Form loading
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorModal, setErrorModal] = useState(false);

    const handleCloseErrorModal = () => {
        setErrorModal(false);
    }

    // Handle submit login function
    const handleLogin = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);

        const data = {
            email,
            password,
        }

        try {
            const response = await fetch(loginEndpoint, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const resJson = await response.json();
            const userData: User = resJson.user;

            if (response.ok) {
                setIsLoading(false);
                await setUserData({
                    name: userData.name,
                    building_id: userData.building_id,
                    is_vahadbait: userData.isvahadbait,
                    is_management_company: userData.ismanagementcompany,
                    user_id: userData.id,
                    is_logged_in: true
                });
                router.push("/home");
            } else {
                setIsLoading(false);
                setErrorModal(true);
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setErrorModal(true);
        }
    }

    return (
        <>
            <Head>
                <title>HouseKeeper | התחברות</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={style.login_main} dir='rtl'>
                <div className={style.login_logo}>
                    <Image src="/housekeeper.jpg" fill alt="House Keeper" />
                </div>
                <div className={style.login_form}>
                    <h1 className={`blue_title ${style.form_title}`}>התחברות</h1>
                    <form dir='rtl' onSubmit={(e) => handleLogin(e)}>
                        <div className={style.field_container}>
                            <CustomInput value={email} onChange={(e) => setEmail(e.target.value)} label="כתובת אימייל" dir='ltr' type='text' required />
                            <CustomInput value={password} onChange={(e) => setPassword(e.target.value)} label="סיסמה" dir='ltr' type='password' required />
                        </div>
                        <button className={style.submit_btn} type='submit'>התחברות</button>
                        <Link href="/register" className={style.register_text}>
                            עדיין לא רשום? לחץ כאן להרשמה
                        </Link>
                    </form>
                </div>
            </main>
            <ModalMessage isOpen={errorModal} handleClose={handleCloseErrorModal} message="שם המשתמש או הסיסמה לא נכונים. אנא נסו שנית." buttonText='אישור' type='error' />
            {isLoading && <Loader />}
        </>
    )
}
