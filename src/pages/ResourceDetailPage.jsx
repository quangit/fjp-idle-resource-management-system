// Placeholder for S-04-02: Màn hình chi tiết/chỉnh sửa Idle Resource
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useParams } from "react-router-dom";

const ResourceDetailPage = () => {
  const { id } = useParams();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Details - {id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-text-secondary">Resource detail and edit form will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default ResourceDetailPage;
