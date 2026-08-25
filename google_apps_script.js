/**
 * ====================================================================
 * 🍃 GREEN CAFE POS - GOOGLE APPS SCRIPT DATABASE SYNC
 * ====================================================================
 * 
 * PANDUAN PEMASANGAN / UPDATE:
 * 1. Buka Google Sheets Anda: "db green"
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus semua kode lama, lalu tempelkan (paste) seluruh kode ini.
 * 4. Klik tombol "Simpan" (Save / Ctrl+S).
 * 5. Klik "Terapkan" (Deploy) > "Kelola Peluncuran" (Manage Deployments) > Edit > Versi Baru (New version) > Terapkan (Deploy).
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
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", transactions: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
    var transactions = rows.map(function(row) {
      return {
        id: row[0],
        date: row[1],
        time: row[2],
        orderType: row[3],
        table: row[4],
        customer: row[5],
        itemsSummary: row[6],
        subtotal: Number(row[7]),
        discount: Number(row[8]),
        tax: Number(row[9]),
        service: Number(row[10]),
        grandTotal: Number(row[11]),
        paymentMethod: row[12],
        status: row[13]
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", transactions: transactions }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
