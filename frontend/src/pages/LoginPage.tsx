import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { loginUser, getCurrentUserFromToken } from '../modules/user/api/authApi';
import { getOrganization } from '../modules/admin/api/organizationApi';
import { ROUTES } from '../config';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get the return URL from query params if available
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || ROUTES.HOME;

  // Fetch organization data
  const { data: organization } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganization,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUserFromToken();
        if (user) {
          if (user.role === 'admin' || user.role === 'owner') {
            navigate(ROUTES.ADMIN_DASHBOARD);
          } else {
            // Navigate to the return URL if available, otherwise to home
            navigate(returnTo);
          }
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate, returnTo]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      
      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // Navigate based on user role
      if (data.user.role === 'admin' || data.user.role === 'owner') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        // Navigate to the return URL if available, otherwise to home
        navigate(returnTo);
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(credentials);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {organization?.logo && (
            <div className="flex justify-center mb-4">
              <img 
                src={organization.logo} 
                alt="Логотип организации" 
                className="h-16 object-contain"
              />
            </div>
          )}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {organization?.name || 'CoworkHub'}
          </h2>
          <h3 className="mt-2 text-center text-xl font-bold text-gray-900">
            Вход в аккаунт
          </h3>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-primary hover:text-primary/80" style={{ color: organization?.primaryColor }}>
              создайте новый аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Электронная почта</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Электронная почта"
                value={credentials.email}
                onChange={handleChange}
                style={{ 
                  '--tw-ring-color': organization?.primaryColor,
                  borderColor: error ? 'rgb(239 68 68)' : undefined
                } as React.CSSProperties}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={credentials.password}
                onChange={handleChange}
                style={{ 
                  '--tw-ring-color': organization?.primaryColor,
                  borderColor: error ? 'rgb(239 68 68)' : undefined
                } as React.CSSProperties}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loginMutation.isPending}
              style={{ backgroundColor: organization?.primaryColor }}
            >
              {loginMutation.isPending ? 'Вход...' : 'Войти'}
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Демо аккаунты:
            </p>
            <div className="mt-1 space-y-1">
              <p className="text-gray-700">admin@gmail.com (Владелец)</p>
              <p className="text-gray-700">co@worker.co (Администратор)</p>
              <p className="text-gray-700">user@prod.рф (Пользователь)</p>
              <p className="text-gray-500 text-m font-bold">Пароль у всех аккаунтов: 123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;