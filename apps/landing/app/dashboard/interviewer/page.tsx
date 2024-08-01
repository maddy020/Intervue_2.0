import { Meeting, columns } from "./columns";
import { DataTable } from "./data-table";
import Schedule_Dialog from "@/appComponents/schedule_dialog";

async function getData(): Promise<Meeting[]> {
  // Fetch data from your API here.
  return [
    {
      id: "intelligentcoderintelligent",
      meeting_link: "https://intelligent.com",
      status: "Done",
      interviewee_name: "Madhav Setia, Rishav Raj, Harsh Raj",
      Date_and_time: "2024-08-01T12:00:00Z",
    },
    {
      id: "awesomecoderawesome",
      meeting_link: "https://awesome.com",
      status: "Not Done",
      interviewee_name: "Rahul, Rohan, Karan Aujla",
      Date_and_time: "2024-08-01T10:00:00Z",
    },
    {
      id: "outstandingcoderoutstanding",
      meeting_link: "https://outstanding.com",
      status: "Done",
      interviewee_name: "Shahrukh Khan, Salman Khan, Aamir Khan",
      Date_and_time: "2024-08-08T11:30:00Z",
    },
    {
      id: "ohhcoderohh",
      meeting_link: "https://ohh.com",
      status: "Not Done",
      interviewee_name: "Ranveer Singh, Ranbir Kapoor, Hrithik Roshan",
      Date_and_time: "2024-08-02T16:30:00Z",
    },
    {
      id: "amazingcoderamazing",
      meeting_link: "https://amazing.com",
      status: "Done",
      interviewee_name: "Deepika Padukone, Priyanka Chopra, Katrina Kaif",
      Date_and_time: "2024-08-03T14:00:00Z",
    },
    {
      id: "supercoder123",
      meeting_link: "https://super.com",
      status: "Not Done",
      interviewee_name: "Anushka Sharma, Alia Bhatt, Kareena Kapoor",
      Date_and_time: "2024-08-03T09:00:00Z",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-center text-2xl mb-8 underline">
        Interviewer Dashboard
      </h1>
      <Schedule_Dialog />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
