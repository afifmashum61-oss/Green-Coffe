/**
 * ====================================================================
 * 🍃 GREEN CAFE POS - GOOGLE APPS SCRIPT DATABASE SYNC
 * ====================================================================
 * 
 * PANDUAN PEMASANGAN:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Beri nama Google Sheets: "Green Cafe POS Database"
 * 3. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 4. Hapus semua kode default, lalu tempelkan (paste) seluruh kode ini.
 * 5. Klik tombol "Simpan" (Save / Ctrl+S).
 * 6. Klik "Terapkan" (Deploy) > "Terapkan sebagai aplikasi web" (New deployment).
 * 7. Pada bagian "Siapa yang memiliki akses" (Who has access), pilih: "Siapa saja" (Anyone).
 * 8. Klik "Terapkan" (Deploy), lalu izinkan akses (Authorize Access).
 * 9. Salin URL Aplikasi Web (Web App URL) yang dihasilkan.
 * 10. Tempelkan URL tersebut ke Pengaturan POS (Tab Settings) di Web Kasir Green Cafe!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Buat Header Otomatis jika Sheet Masih Kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Transaksi", 
        "Tanggal", 
        "Waktu", 
        "Tipe Pesanan", 
        "Nomor Meja", 
        "Nama Pelanggan", 
        "Daftar Menu & Qty", 
        "Subtotal (Rp)", 
        "Diskon (Rp)", 
        "PPN 10% (Rp)", 
        "Service 5% (Rp)", 
        "Total Pembayaran (Rp)", 
        "Metode Pembayaran", 
        "Status Order"
      ]);

      // Format Header Sheet (Bold & Background Hijau)
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1E5128");
      headerRange.setFontColor("#FFFFFF");
    }
    
    // Format Rincian Item Pesanan
    var itemsSummary = data.items.map(function(item) {
      var optionsText = item.options && item.options.length > 0 ? " [" + item.options.join(", ") + "]" : "";
      var noteText = item.note ? " (Note: " + item.note + ")" : "";
      return item.qty + "x " + item.name + optionsText + noteText + " @ Rp " + item.price;
    }).join("\n");

    // Tanggal Terformat
    var dateFormatted = new Date(data.date).toLocaleDateString("id-ID");

    // Masukkan Baris Transaksi Baru
    sheet.appendRow([
      data.id,
      dateFormatted,
      data.time,
      data.orderType,
      data.table,
      data.customer,
      itemsSummary,
      data.subtotal,
      data.discount,
      data.tax,
      data.service,
      data.grandTotal,
      data.paymentMethod,
      data.status
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Transaksi berhasil disimpan ke Google Sheets!", id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("🍃 Green Cafe POS Database API Active!")
    .setMimeType(ContentService.MimeType.TEXT);
}
