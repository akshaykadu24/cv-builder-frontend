import html2canvas from "html2canvas"
// import html2pdf from "html2pdf.js";
import jsPDF from 'jspdf'

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            resolve(false);
        };

        document.body.appendChild(script);
    });
};

const handleDownload = (component_id, resumeName) => {
    try {
        let razpayfunction = async () => {

            const isLoaded = await loadRazorpayScript()
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}razerPayment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount: 50000 }) // ₹500 in paisa
            });

            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // your Razorpay public key
                amount: order.amount,
                currency: "INR",
                name: "Resume Builder",
                description: "Download Resume PDF",
                order_id: order.id,
                handler: async function (response) {
                    const input = document.getElementById(component_id);
                    html2canvas(input, { scale: 2 }).then((canvas) => {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`${resumeName}.pdf`);
                    });
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9876543210"
                },
                theme: {
                    color: "#1976d2"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();


        }

        razpayfunction()

        // const input = document.getElementById(component_id)
        // html2canvas(input, { scale: 2 }).then((canvas) => {
        //     const imgData = canvas.toDataURL('image/png')
        //     const pdf = new jsPDF('p', 'mm', 'a4')
        //     const imgProps = pdf.getImageProperties(imgData)
        //     const pdfWidth = pdf.internal.pageSize.getWidth()
        //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        //     pdf.save(`${resumeName}.pdf`)
        // })
        ///////////////////////////////////////////////////////////////////////////
        // const input = document.getElementById(component_id);

        // html2canvas(input, { scale: 2 }).then((canvas) => {
        //     const imgData = canvas.toDataURL("image/png");

        //     const pdf = new jsPDF("p", "mm", "a4");
        //     const pdfWidth = pdf.internal.pageSize.getWidth();
        //     const pdfHeight = pdf.internal.pageSize.getHeight();

        //     const imgWidth = pdfWidth;
        //     const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        //     let heightLeft = imgHeight;
        //     let position = 0;

        //     // Add first page
        //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        //     heightLeft -= pdfHeight;

        //     // Add extra pages
        //     while (heightLeft > 0) {
        //         position = heightLeft - imgHeight;
        //         pdf.addPage();
        //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        //         heightLeft -= pdfHeight;
        //     }

        //     pdf.save(`${resumeName}.pdf`);
        // });
        ///////////////////////////////////////////////////////////////
        // const element = document.getElementById(component_id);

        // const opt = {
        //     margin: 0.5,                     // Inches
        //     filename: `${resumeName}.pdf`,
        //     image: { type: 'jpeg', quality: 0.98 },
        //     html2canvas: { scale: 2 },
        //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        //     pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        // };

        // html2pdf().set(opt).from(element).save();

    } catch (error) {
        console.log("payment failed", error)
    }

}



export default handleDownload