import { useApp } from "../../context/AppContext.jsx";
import Header from "./Header.jsx";
import MenuDrawer from "./MenuDrawer.jsx";
import SearchOverlay from "./SearchOverlay.jsx";
import Toast from "./Toast.jsx";
import AuthModal from "../modals/AuthModal.jsx";
import AccountEditModal from "../modals/AccountEditModal.jsx";
import AddressEditModal from "../modals/AddressEditModal.jsx";
import ProfileEditModal from "../modals/ProfileEditModal.jsx";
import Home from "../pages/Home.jsx";
import Catalogue from "../pages/Catalogue.jsx";
import DesignDetail from "../pages/DesignDetail.jsx";
import OrderFlow from "../pages/OrderFlow.jsx";
import Cart from "../pages/Cart.jsx";
import Track from "../pages/Track.jsx";
import HowItWorks from "../pages/HowItWorks.jsx";
import Offers from "../pages/Offers.jsx";
import Reviews from "../pages/Reviews.jsx";
import Account from "../pages/Account.jsx";
import OrderDone from "../pages/OrderDone.jsx";

export default function AppShell() {
  const { scrollRef, isHome, isCatalogue, isDesign, isOrder, isCart, isTrack, isHow, isOffers, isReviews, isAccount, isDone } = useApp();

  return (
    <div id="ms-app" style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#F9F9F7", color: "#181818", fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: "hidden" }}>
      <Header />

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
        {isHome && <Home />}
        {isCatalogue && <Catalogue />}
        {isDesign && <DesignDetail />}
        {isOrder && <OrderFlow />}
        {isCart && <Cart />}
        {isTrack && <Track />}
        {isHow && <HowItWorks />}
        {isOffers && <Offers />}
        {isReviews && <Reviews />}
        {isAccount && <Account />}
        {isDone && <OrderDone />}
      </div>

      <AuthModal />
      <AccountEditModal />
      <AddressEditModal />
      <ProfileEditModal />
      <MenuDrawer />
      <SearchOverlay />
      <Toast />
    </div>
  );
}
