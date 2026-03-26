import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MeterTable({ meters }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl. No</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Installer</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Meter Type</TableHead>
            <TableHead>Installation</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className={"h-[80vh] overflow-y-scroll"}>
          {meters.map((meter, index) => (
            <TableRow key={meter._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{meter.meterNumber}</TableCell>

              <TableCell>{meter.installerId}</TableCell>

              <TableCell>{meter.agency}</TableCell>

              <TableCell>{meter.storeLocation}</TableCell>

              <TableCell>{meter.meterType}</TableCell>

              <TableCell>{meter.installationType}</TableCell>

              <TableCell className="capitalize">{meter.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
