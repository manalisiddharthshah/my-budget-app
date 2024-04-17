import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface WithAuthProps {
  // Add any additional props as needed
}

const withAuth = (WrappedComponent: React.ComponentType<WithAuthProps>) => {
  const WithAuth = (props: WithAuthProps) => {
    const router = useRouter();

    useEffect(() => {
      // Check if the user is not authenticated and redirect to the home page
      if (!localStorage.getItem('user_id')) {
        router.replace('/');
      }
    }, []);

    // Pass the props to the wrapped component
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
