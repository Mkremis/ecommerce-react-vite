import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverLogout } from "../helpers/serverLogout";
import { processUserData } from "../helpers/processUserData";
import { reloadSession } from "../helpers/reloadSession";
import { login } from "../api/authRequests";

const AuthContext = createContext({});
const initialProductQ = 0;
const initialCart = {};
const initialLikes = [];

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [productQ, setProductQ] = useState(initialProductQ);
  const [cart, setCart] = useState(initialCart);
  const [cartItems, setCartItems] = useState(0);
  const [page, setPage] = useState(1);
  const [likes, setLikes] = useState(initialLikes);
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [errors, setErrors] = useState([]);

  const refreshPage = (newPage = null) => {
    setPage(1);
    navigate(newPage);
  };
  const handlePlusQ = () => setProductQ(productQ + 1);
  const handleMinusQ = () =>
    productQ === 0 ? false : setProductQ(productQ - 1);

  const handleLogout = () => {
    navigate("/");
    setAuth(null);
    localStorage.removeItem("persist");
    setPersist(false);
    setCart(initialCart);
    setCartItems(initialProductQ);
    setLikes(initialLikes);
    serverLogout();
  };

  useEffect(() => {
    const checkLogin = async () => {
      if (!persist) return;
      try {
        const response = await reloadSession();
        const { userData } = response?.data;
        const userCart = userData.user_cart;
        const userLikes = userData.user_likes;
        const userInfo = processUserData({ userData });
        setAuth(userInfo);
        setCart(userCart || initialCart);
        setLikes(userLikes || initialLikes);
      } catch (error) {
        handleLogout();
      }
    };
    checkLogin();
  }, []);

  const handleAuth = async (e) => {
    try {
      let { username, psw } = e.target;
      username = username.value;
      psw = psw.value;
      const response = await login(username, psw);
      console.log(response);
      const { user_data, user_cart, user_likes } = response.data;
      console.log(user_likes);
      setAuth(processUserData(user_data));
      setCart(user_cart || initialCart);
      setLikes(user_likes || initialLikes);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };
  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const data = {
    errors,
    persist,
    setPersist,
    likes,
    setLikes,
    auth,
    setAuth,
    handleAuth,
    handleLogout,
    handlePlusQ,
    handleMinusQ,
    setProductQ,
    productQ,
    cart,
    setCart,
    page,
    setPage,
    refreshPage,
    cartItems,
    setCartItems,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
export { AuthProvider };
export default AuthContext;
