import Head from 'next/head'
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Alert, Button, Form, Input, Layout, Typography } from 'antd'
import styles from '../styles/Home.module.css'

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

type ShortenLinkResponse = {
  short_link: string;
}

type ShortenLinkError = {
  error: string;
  error_description: string;
}

type FormValues = {
  link: string;
}

export default function Home() {
  // The application sets three states
  // 'initial' is when application is loaded and user hasn't taken any action yet
  // 'success' when user has copy-paste the link, clicked "Shorten" and our app generate a link
  // 'error' is handling when something went wrong and display any errors
  const [status, setStatus] = useState<'initial' | 'error' | 'success'>('initial');
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  // There are two methods dealing with forms
  // 'onFinish' to make a request to our API to generate a link
  // 'onFinishedFailed' is responsible for displaying the form validation errors
  const onFinish = async ({ link }: FormValues) => {
    try {
      const response = await axios.post<ShortenLinkResponse>('/api/shorten_link', { link });
      setStatus('success');
      setMessage(response.data?.short_link);
    }
    catch(e) {
      const error = e as AxiosError<ShortenLinkError>;
      setStatus('error');
      setMessage(error.response?.data?.error_description || 'Something went wrong!');
    }
  }

  const onFinishedFailed = () => {
    setStatus('error');
    const error = form.getFieldError('link').join(' ');
    setMessage(error);
  }

  return (
    <Layout>
      <Head>
        <title>A Link Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo} />
      </Header>
      <Content className={styles.content}>
        <div className={styles.shortner}>
          <Title level={5}>Copy &amp; Paste your lengthy link</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishedFailed}
          >
            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item name="link" noStyle rules={[{
                  required: true,
                  message: 'Please paste a correct link',
                  type: 'url',
                }]}>
                  <Input placeholder="https://my-super-long-link.com/blah-blah-blah-blah-blah-blah-blah-blah-blah-blah-blah-blah" size="large"/>
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
                    Shorten!
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error', 'success'].includes(status) && (<Alert showIcon message={message} type={status as 'error' | 'success'} />)}
        </div>
      </Content>
      <Footer className={styles.footer}>
        A Link Shortener (ALS) &copy; 2021
      </Footer>
    </Layout>
  )
}
