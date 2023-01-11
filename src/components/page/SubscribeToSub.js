function SubscribeToSub({ isLoggedIn }) {
  return (
    <button
      className="subscribe-button"
      disabled={!isLoggedIn}
      style={{ width: "fit-content" }}
    >
      subscribe
    </button>
  );
}

export { SubscribeToSub };
