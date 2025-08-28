import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
    return (<>
        <main className="pad-top-bot-24px overflow-hiden">
            <div className="grid">
                <div className="row">
                    <div className="col c-10 m-10 l-6 c-o-1 l-o-3 ">
                        <section className="w-full border-radius-8px pad-bot-12px box-shadow-1">
                            <h1 className="pad-top-bot-12px text-align-center">Đăng nhập</h1>
                            <form className="flex flex-col row-gap-10px justify-center pad-left-right-24px" action="">

                                <div className="pad-left-8px w-full text-error">
                                    **
                                    <span className="fs-1rem">Tài khoản không hợp lệ</span>
                                </div>
                                {/* input */}
                                <input autoComplete="on" name="email" className="no-border fs-1d2rem  border-radius-8px border-bot-style-1 pad-8px w-full h-3rem" type="email" placeholder="Tài khoản" />
                                <input autoComplete="on" name="password" className="no-border fs-1d2rem  border-radius-8px border-bot-style-1 pad-8px w-full h-3rem" type="password" placeholder="Mật khẩu" />

                                {/* terms & policy */}
                                <div className="w-full flex align-center mar-top-12px pad-top-12px">
                                    <label className="flex align-center cursor-pointer">
                                        <input name="agree" type="checkbox" className="mar-right-8px" />
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

                                <div className="w-full">
                                    Chưa có tài khoản? <b>đăng ký</b>&nbsp;
                                    <Link to="/register">tại đây</Link>
                                </div>

                                {/* actions */}
                                <button
                                    type="submit"
                                    className="no-border w-full bg-primary pad-8px flex flex-center cursor-pointer mar-top-12px border-radius-8px"
                                    onClick={e => e.preventDefault()}
                                >
                                    <span className="fs-1d4rem">Đăng nhập</span>
                                </button>
                            </form>

                            {/* other method */}
                            <div className="w-full flex flex-center align-center pad-8px mar-top-24px">
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.15)", marginRight: 12 }} />
                                <span className="fw-300">Hoặc đăng nhập với</span>
                                <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.15)", marginLeft: 12 }} />
                            </div>
                            <div className="w-full flex flex-center mar-top-12px">
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