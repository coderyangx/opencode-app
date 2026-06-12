import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form } from '@douyinfe/semi-ui';
import { User, Mail, Lock } from 'lucide-react';
import Mascot from './Mascot';
import { loginApi } from '../../services/supabase';
import './index.less';
import { toast } from 'sonner';

interface LoginProps {
  onAuthSuccess?: () => void;
}

export default function Login({ onAuthSuccess }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/chat';

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coverEyes, setCoverEyes] = useState(false);

  const handleLogin = async (values: { username?: string; email: string; password: string }) => {
    const { username, email, password } = values;
    if (!email || !password) return toast.error('请填写邮箱和密码');

    try {
      setLoading(true);
      if (isLogin) {
        // 登录
        // const res = await supabase.auth.signInWithOtp({ email });
        await loginApi.signIn({ email, password });
        navigate(from, { replace: true });
        onAuthSuccess?.();
        return toast.success('登录成功！');
      }
      // 注册
      if (!username) {
        toast.error('请填写用户名');
        setLoading(false);
        return;
      }
      await loginApi.signUp({
        email,
        password,
        options: { data: { username } }
      });
      // toast.success('注册成功！请查收验证邮件');
      // 邮件验证已在 Supabase Dashboard 关闭，注册后直接登录
      await loginApi.signIn({ email, password });
      navigate(from, { replace: true });
      onAuthSuccess?.();
      toast.success('注册成功！');
    } catch (error: any) {
      console.error('认证错误:', error);
      toast.error(error.message || (isLogin ? '登录失败' : '注册失败'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCoverEyes(false);
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          {/* <div className='login-icon'>
            {isLogin ? <IconUser size='extra-large' /> : <IconUserAdd size='extra-large' />}
          </div> */}
          <Mascot hideEyes={coverEyes} />
          <h2 className='login-title'>{isLogin ? '欢迎回来' : '创建账户'}</h2>
          <p className='login-subtitle'>{isLogin ? '登录您的账户以继续' : '注册一个新账户'}</p>
        </div>

        <Form
          className='login-form'
          layout='vertical'
          labelPosition='top'
          labelWidth={70}
          // getFormApi={(formApi) => (api.current = formApi)}
          // onValueChange={(values) => setEmail(values.email)}
          onSubmit={(values) => handleLogin(values)}
        >
          {!isLogin && (
            <Form.Input
              field='username'
              label='用户名'
              placeholder='请输入用户名'
              prefix={<User size={16} />}
              autoComplete='off'
              rules={[{ required: !isLogin, message: '请输入用户名' }]}
            />
          )}
          <Form.Input
            field='email'
            label='邮箱'
            placeholder='请输入邮箱地址'
            prefix={<Mail size={16} />}
            autoComplete='off'
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          />
          <Form.Input
            mode='password'
            field='password'
            label='密码'
            placeholder='请输入密码'
            prefix={<Lock size={16} />}
            onFocus={() => setCoverEyes(true)}
            onBlur={() => setCoverEyes(false)}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          />

          <Button
            htmlType='submit'
            theme='solid'
            type='primary'
            size='large'
            block
            disabled={loading}
            className={`login-submit-btn${loading ? ' is-loading' : ''}`}
          >
            <span className='btn-loading-content'>
              {loading && <span className='btn-spinner' />}
              {isLogin ? '登录' : '注册'}
            </span>
          </Button>
        </Form>

        <div className='login-footer'>
          <span className='login-footer-text'>{isLogin ? '还没有账户？' : '已有账户？'}</span>
          <Button type='tertiary' onClick={toggleMode} className='login-toggle-btn'>
            {isLogin ? '立即注册' : '立即登录'}
          </Button>
        </div>
      </div>
    </div>
  );
}
