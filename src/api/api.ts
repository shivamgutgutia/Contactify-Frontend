import axios from "axios";

interface response {
  data: any;
  status: number;
  message: string;
}

interface sample {
  "E-Mail": string;
  "First Name": string;
  "Last Name": string;
  "Middle Name": string;
  "Phone Number(s)": string;
  Prefix: string;
  Suffix: string;
}

export async function getHeaders(file: File) {
  let temp: response = {
    data: null,
    status: 500,
    message: "Something went wrong! Please try again later.",
  };
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post<{ headers: string[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/headers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      },
    );
    temp = {
      data: data.headers,
      status: 200,
      message: "Success",
    };
  } catch (err) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 400) {
        temp = {
          data: null,
          status: 400,
          message: err.response.data ?? "Please check your file and try again.",
        };
      }
    }
  } finally {
    return temp;
  }
}

export async function getSampleVCF(formData: FormData) {
  let temp: response = {
    data: null,
    status: 500,
    message: "Something went wrong! Please try again later.",
  };
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/vcf`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      },
    );
    temp = {
      data: data as sample,
      status: 200,
      message: "Success",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 400) {
        temp = {
          data: null,
          status: 400,
          message:
            err.response.data ?? "Please check your inputs and try again.",
        };
      }
    }
  } finally {
    return temp;
  }
}

export async function getVCF(formData: FormData) {
  let temp: response = {
    data: null,
    status: 500,
    message: "Something went wrong! Please try again later.",
  };
  try {
    const {data}  = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/vcf`,
      formData,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      },
    );
    const file = formData.get("file") as File;
    if (formData.get("splitVCF") === "true") {
      // const arrayBuffer = await data.arrayBuffer();
      const blob = new Blob([data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.substring(
        0,
        file.name.lastIndexOf("."),
      )}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.substring(
        0,
        file.name.lastIndexOf("."),
      )}.vcf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}
