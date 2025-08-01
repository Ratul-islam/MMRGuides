import { Container, Paper, Skeleton, Box } from '@mui/material';

export default function BlogDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <Container maxWidth="lg">
          <div className="flex items-center justify-between py-4">
            <Skeleton variant="rectangular" width={120} height={36} />
            <div className="flex space-x-2">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </div>
        </Container>
      </div>

      <Container maxWidth="md" className="py-8">
        {/* Article Header Skeleton */}
        <Paper elevation={0} className="mb-8 p-8 bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <Skeleton variant="rectangular" width={100} height={24} />
            <Skeleton variant="text" width={120} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width={80} height={24} />
            ))}
          </div>
          
          <Skeleton variant="text" width="100%" height={60} className="mb-4" />
          <Skeleton variant="text" width="80%" height={60} className="mb-6" />
          
          <Skeleton variant="text" width="100%" height={32} className="mb-8" />
          
          <div className="flex items-center space-x-4">
            <Skeleton variant="circular" width={56} height={56} />
            <div>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={200} height={20} />
            </div>
          </div>
        </Paper>

        {/* Featured Image Skeleton */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400} 
          className="mb-8 rounded-2xl"
        />

        {/* Content Skeleton */}
        <Paper elevation={0} className="p-8 bg-white rounded-2xl mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton 
              key={i} 
              variant="text" 
              width={i % 3 === 0 ? "60%" : "100%"} 
              height={24} 
              className="mb-4"
            />
          ))}
        </Paper>

        {/* Footer Skeleton */}
        <Paper elevation={0} className="p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Skeleton variant="rectangular" width={80} height={36} />
              <Skeleton variant="rectangular" width={80} height={36} />
            </div>
            <Skeleton variant="rectangular" width={140} height={36} />
          </div>
        </Paper>
      </Container>
    </div>
  );
}