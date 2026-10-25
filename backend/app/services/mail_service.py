import html
import mimetypes
import socket
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path
import re
from typing import Mapping

from app.core.config import settings


TEMPLATE_ROOT = Path(__file__).resolve().parents[1] / "templates"
PLACEHOLDER_PATTERN = re.compile(r"{{\s*([a-zA-Z0-9_]+)\s*}}")


def render_email_template(template_name: str, values: Mapping[str, object]) -> str:
    template_path = (TEMPLATE_ROOT / template_name).resolve()
    if template_path.parent != TEMPLATE_ROOT.resolve():
        raise ValueError("Invalid email template path.")
    template = template_path.read_text(encoding="utf-8")

    def replace(match: re.Match[str]) -> str:
        value = values.get(match.group(1), "")
        return html.escape(str(value or "-"), quote=True)

    return PLACEHOLDER_PATTERN.sub(replace, template)


def _addresses(value: str) -> list[str]:
    return [address.strip() for address in value.split(",") if address.strip()]


def _render_branded_email(
    *, heading: str, intro: str, fields: Mapping[str, object]
) -> str:
    heading_lower = heading.lower()
    if "admission" in heading_lower or "applying" in heading_lower:
        status_label = "APPLICATION RECEIVED"
        next_step = "Our admissions team will review the application and contact you using the details provided. Please keep your registration number for future communication."
    elif "newsletter" in heading_lower:
        status_label = "SUBSCRIPTION CONFIRMED"
        next_step = "You are now on our mailing list. School news, announcements and important updates will be delivered to this email address."
    else:
        status_label = "ENQUIRY RECEIVED"
        next_step = "Our school team will review your enquiry and respond using the email address or phone number you provided."

    reference = next(
        (
            str(value)
            for label, value in fields.items()
            if "reference" in str(label).lower() or "registration" in str(label).lower()
        ),
        "",
    )
    rows = "".join(
        "<tr>"
        f"<td style='width:38%;padding:14px 16px;background:#f8fbff;border-bottom:1px solid #e8eff7;"
        f"font-size:12px;font-weight:700;letter-spacing:.2px;color:#60758f'>{html.escape(str(label))}</td>"
        f"<td style='padding:14px 16px;border-bottom:1px solid #e8eff7;font-size:14px;line-height:1.55;"
        f"color:#172b4d;word-break:break-word'>{html.escape(str(value or '-'))}</td>"
        "</tr>"
        for label, value in fields.items()
    )
    intro_html = (
        f"<p style='margin:0;color:#526b86;font-size:14px;line-height:1.7'>{html.escape(intro)}</p>"
        if intro
        else ""
    )
    return f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{html.escape(heading)}</title></head>
<body style="margin:0;padding:0;background:#f3f7fd;font-family:Arial,Helvetica,sans-serif;color:#172b4d;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">{html.escape(status_label.title())} by Rosary School.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7fd;padding:28px 8px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#fff;border:1px solid #d9e6f5;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(16,40,77,.08);">
        <tr><td align="center" style="padding:29px 20px 25px;background:#0768d7;color:#fff;">
          <table role="presentation" cellspacing="0" cellpadding="0"><tr>
            <td align="center" valign="middle" style="width:48px;height:48px;border:2px solid #9fd0ff;border-radius:50%;font-size:22px;font-weight:bold;color:#fff;">R</td>
          </tr></table>
          <div style="margin-top:12px;font-size:10px;font-weight:bold;letter-spacing:2.5px;color:#cfe8ff;">ROSARY SCHOOL</div>
          <div style="margin-top:6px;font-size:20px;font-weight:bold;line-height:1.3;">Rosary Matriculation Higher Secondary School</div>
        </td></tr>
        <tr><td align="center" style="padding:32px 26px 8px;">
          <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding:7px 13px;background:#eaf8f1;border:1px solid #bce8d1;border-radius:20px;font-size:10px;font-weight:bold;letter-spacing:1.3px;color:#137647;">&#10003;&nbsp; {html.escape(status_label)}</td></tr></table>
          <h1 style="margin:17px 0 10px;font-size:24px;line-height:1.3;color:#10284d;">{html.escape(heading)}</h1>
          {intro_html}
        </td></tr>
        {f'''<tr><td style="padding:18px 26px 4px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef6ff;border:1px solid #cfe4fb;border-radius:12px;"><tr><td align="center" style="padding:18px;"><div style="font-size:10px;font-weight:bold;letter-spacing:1.4px;color:#607b9b;">YOUR REFERENCE NUMBER</div><div style="margin-top:7px;font-size:24px;font-weight:bold;letter-spacing:1px;color:#0755ad;">{html.escape(reference)}</div></td></tr></table></td></tr>''' if reference else ''}
        <tr><td style="padding:20px 26px 8px;">
          <div style="margin-bottom:10px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#365a80;">SUBMITTED DETAILS</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #dce9f7;border-radius:11px;border-collapse:separate;border-spacing:0;overflow:hidden;">{rows}</table>
        </td></tr>
        <tr><td style="padding:16px 26px 30px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff9e9;border:1px solid #f2dfaa;border-radius:11px;"><tr><td style="padding:17px 18px;"><div style="font-size:13px;font-weight:bold;color:#735515;">What happens next?</div><div style="margin-top:6px;font-size:13px;line-height:1.65;color:#725f32;">{html.escape(next_step)}</div></td></tr></table>
        </td></tr>
        <tr><td align="center" style="padding:22px 18px;background:#f6f9fe;border-top:1px solid #e2ebf7;font-size:11px;line-height:1.7;color:#7589a2;">
          <strong style="color:#25466a;">Rosary Matriculation Higher Secondary School</strong><br>
          Thank you for choosing Rosary School.<br>
          <span style="color:#90a1b5;">This is an automated confirmation from the school website.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


class _SMTPSSLWithServerName(smtplib.SMTP_SSL):
    """Connect to one address while verifying TLS against the SMTP hostname."""

    def __init__(self, *, server_hostname: str, timeout: float) -> None:
        self._tls_server_hostname = server_hostname
        super().__init__(host="", timeout=timeout, context=ssl.create_default_context())

    def _get_socket(self, host: str, port: int, timeout: float):
        raw_socket = socket.create_connection(
            (host, port), timeout, self.source_address
        )
        return self.context.wrap_socket(
            raw_socket, server_hostname=self._tls_server_hostname
        )


def _open_smtp_client() -> smtplib.SMTP:
    connect_host = settings.SMTP_CONNECT_HOST or settings.SMTP_HOST

    if settings.SMTP_PORT == 465:
        client = _SMTPSSLWithServerName(
            server_hostname=settings.SMTP_HOST,
            timeout=15,
        )
        client.connect(connect_host, settings.SMTP_PORT)
        return client

    client = smtplib.SMTP(connect_host, settings.SMTP_PORT, timeout=15)
    # smtplib uses _host as the TLS SNI/certificate name during STARTTLS.
    client._host = settings.SMTP_HOST
    return client


def send_submission_email(
    *,
    subject: str,
    heading: str,
    fields: Mapping[str, object],
    reply_to: str,
    to_value: str,
    cc_value: str,
    bcc_value: str,
    intro: str = "",
    html_body: str | None = None,
    inline_images: Mapping[str, Path] | None = None,
) -> None:
    to = _addresses(to_value)
    cc = _addresses(cc_value)
    bcc = _addresses(bcc_value)

    if not settings.SMTP_HOST or not settings.SMTP_FROM_EMAIL or not to:
        raise RuntimeError("SMTP host, sender, and at least one To recipient must be configured.")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr((settings.SMTP_FROM_NAME, settings.SMTP_FROM_EMAIL))
    message["To"] = ", ".join(to)
    if cc:
        message["Cc"] = ", ".join(cc)
    if reply_to:
        message["Reply-To"] = reply_to
    plain_body = "\n".join(f"{label}: {value or '-'}" for label, value in fields.items())
    message.set_content(f"{intro}\n\n{plain_body}" if intro else plain_body)
    message.add_alternative(
        html_body or _render_branded_email(heading=heading, intro=intro, fields=fields),
        subtype="html",
    )
    if inline_images:
        html_part = message.get_payload()[-1]
        for content_id, image_path in inline_images.items():
            mime_type, _ = mimetypes.guess_type(image_path.name)
            maintype, subtype = (mime_type or "image/jpeg").split("/", 1)
            html_part.add_related(
                image_path.read_bytes(),
                maintype=maintype,
                subtype=subtype,
                cid=f"<{content_id}>",
                filename=image_path.name,
                disposition="inline",
            )

    recipients = [*to, *cc, *bcc]
    client = _open_smtp_client()
    try:
        if settings.SMTP_USE_TLS and settings.SMTP_PORT != 465:
            client.starttls()
        if settings.SMTP_USERNAME:
            client.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        client.send_message(message, to_addrs=recipients)
    finally:
        try:
            client.quit()
        except smtplib.SMTPServerDisconnected:
            # Some SMTP servers close the socket immediately after accepting
            # a larger MIME message. Delivery succeeded if send_message did.
            pass
