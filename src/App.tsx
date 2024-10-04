import { Flex, Layout } from "antd";
import { CSSProperties } from "react";

import Movies from "./components/Movies";

const { Content } = Layout;

const pageContentStyle: CSSProperties = {
  minHeight: "100vh",
  maxWidth: 1010,
  padding: "1.5rem",
  background: "#fff",
};

const App = () => {
  return (
    <Layout>
      <Flex justify="center">
        <Content style={pageContentStyle}>
          <Flex justify="center" vertical>
            <Movies />
          </Flex>
        </Content>
      </Flex>
    </Layout>
  );
};

export default App;
