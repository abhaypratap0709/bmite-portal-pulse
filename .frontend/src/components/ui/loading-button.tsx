import { Button, ButtonProps } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = ({ 
  loading = false, 
  loadingText = "Loading...", 
  children, 
  className,
  disabled,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && (
        <Spinner size="sm" className="mr-2" />
      )}
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
