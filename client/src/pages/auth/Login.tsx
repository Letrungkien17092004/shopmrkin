import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
    return (<>
        <main className="padding-top-bot-24px overflow-hiden">
            <div className="grid">
                <div className="row">
                    <div className="col c-10 m-10 l-6 c-o-1 l-o-3 ">
                        <section className="width-full border-radius-8px padding-bot-12px box-shadow-1">
                            <h1 className="padding-top-bot-12px text-align-center">Đăng nhập</h1>
                            <form className="flex flex-column row-gap-10px justify-content-center padding-left-right-24px" action="">

                                <div className="padding-left-8px width-full text-error">
                                    **
                                    <span className="font-size-1rem">Tài khoản không hợp lệ</span>
                                </div>
                                {/* input */}
                                <input autoComplete="on" name="email" className="no-border font-size-1d2rem  border-radius-8px border-bot-style-1 padding-8px width-full height-3rem" type="email" placeholder="Tài khoản" />
                                <input autoComplete="on" name="password" className="no-border font-size-1d2rem  border-radius-8px border-bot-style-1 padding-8px width-full height-3rem" type="password" placeholder="Mật khẩu" />

                                {/* terms & policy */}
                                <div className="width-full flex align-items-center margin-top-12px padding-top-12px">
                                    <label className="flex align-items-center cursor-pointer">
                                        <input name="agree" type="checkbox" className="margin-right-8px" />
                                        <span>
                                            Tôi đồng ý với&nbsp;
                                            <a href="/terms" target="_blank" rel="noopener noreferrer">
                                                các điều khoản
                                            </a>
                                            &nbsp;và&nbsp;
                                            <a href="/policy" target="_blank" rel="noopener noreferrer">
                                                chính sách
                                            </a>
                                        </span>
                                    </label>
                                </div>

                                <div className="width-full">
                                    Chưa có tài khoản? <b>đăng ký</b>&nbsp;
                                    <Link to="/register">tại đây</Link>
                                </div>

                                {/* actions */}
                                <button
                                    type="submit"
                                    className="no-border width-full bg-primary padding-8px flex flex-center cursor-pointer margin-top-12px border-radius-8px"
                                    onClick={e => e.preventDefault()}
                                >
                                    <span className="font-size-1d4rem">Đăng nhập</span>
                                </button>
                            </form>

                            {/* other method */}
                            <div className="width-full flex flex-center align-items-center padding-8px margin-top-24px">
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.15)", marginRight: 12 }} />
                                <span className="font-weight-300">Hoặc đăng nhập với</span>
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.15)", marginLeft: 12 }} />
                            </div>
                            <div className="width-full flex flex-center margin-top-12px">
                                <div className="flex flex-center cursor-pointer">
                                    <img src="/public/image/google-48.png" alt="google-icon" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </>)
}