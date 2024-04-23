type Props = {
  children: React.ReactNode
};

export default function FeedWrapper({ children }: Props) {
  return (
    <div className="flex-1 relative top-5 pb-5">
      {children}
    </div>
  );
}