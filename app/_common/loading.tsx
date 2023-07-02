import { Loader } from "@mantine/core";

export const SpinCss: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  backgroundColor: "#8888",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const Loading = () => {
  return (
    <div style={SpinCss}>
      <h1>Loding...</h1>
      <br />
      <Loader size="xl" />
    </div>
  );
};
