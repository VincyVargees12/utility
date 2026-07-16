using Microsoft.AspNetCore.Mvc;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using PdfSharp.Pdf.Security;
using System.IO;

namespace Data_Util_core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfController : ControllerBase
    {
        [HttpPost("protect")]
        public IActionResult ProtectPdf([FromForm] IFormFile file, [FromForm] string password)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid PDF file.");

            if (string.IsNullOrEmpty(password) || password.Length < 4)
                return BadRequest("Password must be at least 4 characters long.");

            try
            {
                using var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                memoryStream.Position = 0;

                // Load the uploaded PDF document
                using PdfSharp.Pdf.PdfDocument document = PdfReader.Open(memoryStream, PdfDocumentOpenMode.Modify);

                // Setup security settings
                var securitySettings = document.SecuritySettings;

                // Set passwords
                securitySettings.UserPassword = password;
                securitySettings.OwnerPassword = password;

                using var outputStream = new MemoryStream();
                document.Save(outputStream);
                
                var originalName = Path.GetFileNameWithoutExtension(file.FileName);
                return File(outputStream.ToArray(), "application/pdf", $"{originalName}_protected.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("unlock")]
        public IActionResult UnlockPdf([FromForm] IFormFile file, [FromForm] string password)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid PDF file.");

            try
            {
                using var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                memoryStream.Position = 0;

                // Load the encrypted document using Import mode.
                // Import mode ignores document-level features like encryption when the pages are copied.
                using PdfSharp.Pdf.PdfDocument document = PdfReader.Open(memoryStream, password ?? "", PdfDocumentOpenMode.Import);

                // Create a completely new document (which is unencrypted by default)
                using PdfSharp.Pdf.PdfDocument outDoc = new PdfSharp.Pdf.PdfDocument();
                
                // Copy all pages from the encrypted document to the clean document
                for (int i = 0; i < document.PageCount; i++)
                {
                    outDoc.AddPage(document.Pages[i]);
                }

                using var outputStream = new MemoryStream();
                outDoc.Save(outputStream);
                
                var originalName = Path.GetFileNameWithoutExtension(file.FileName);
                return File(outputStream.ToArray(), "application/pdf", $"{originalName}_unlocked.pdf");
            }
            catch (PdfSharp.Pdf.IO.PdfReaderException ex) when (ex.Message.Contains("Password") || ex.Message.Contains("password") || ex.Message.Contains("encrypt"))
            {
                return BadRequest("Incorrect password.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
