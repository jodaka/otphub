package com.kudris.otphub

import android.app.Activity
import android.net.Uri
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.io.FileNotFoundException

@InvokeArg
class WriteTextToUriArgs {
  lateinit var uri: String
  lateinit var contents: String
}

/**
 * Writes text to a `content://` URI returned by the save dialog.
 *
 * The fs plugin hands the detached file descriptor to Rust and closes the
 * Java-side descriptor immediately, which makes content providers finalize
 * the file metadata with a 0 byte length. Writing through ContentResolver
 * keeps the output stream alive until the data is fully written.
 */
@TauriPlugin
class ContentResolverPlugin(private val activity: Activity) : Plugin(activity) {
  @Command
  fun writeTextToUri(invoke: Invoke) {
    try {
      val args = invoke.parseArgs(WriteTextToUriArgs::class.java)
      val uri = Uri.parse(args.uri)
      val resolver = activity.contentResolver
      val outputStream = (try {
        resolver.openOutputStream(uri, "wt")
      } catch (error: FileNotFoundException) {
        resolver.openOutputStream(uri, "w")
      }) ?: throw IllegalStateException("Cannot open output stream for URI: ${args.uri}")
      outputStream.use { output ->
        output.write(args.contents.toByteArray(Charsets.UTF_8))
        output.flush()
      }
      invoke.resolve(JSObject())
    } catch (error: Throwable) {
      invoke.reject(error.message ?: "Failed to write to content URI")
    }
  }
}
