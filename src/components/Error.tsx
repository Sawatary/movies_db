import { Alert, Empty } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

type ErrorMessagePropsType = {
  message: string;
};

function Error({ message }: ErrorMessagePropsType) {
  const mainMessage = `Error ${message.slice(-3, message.length)}`;
  const description = message.slice(0, -3);

  if (mainMessage === "Error 404")
    return <Empty description="Rate at least one movie first" />;

  return (
    <Alert
      message={mainMessage}
      description={description}
      type="error"
      showIcon
      action={
        <>
          <Paragraph>Errors API SERVER</Paragraph>
        </>
      }
    />
  );
}

export default Error;
