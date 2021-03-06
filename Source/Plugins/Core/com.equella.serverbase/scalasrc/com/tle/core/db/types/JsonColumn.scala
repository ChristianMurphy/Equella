/*
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * The Apereo Foundation licenses this file to you under the Apache License,
 * Version 2.0, (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tle.core.db.types

import io.circe.{Decoder, Encoder, Json, JsonObject}
import io.doolse.simpledba.Iso
import io.circe.syntax._
import io.circe.parser._

trait JsonColumn

object JsonColumn {
  def mkCirceIso[A: Encoder: Decoder](default: A): Iso[A, Option[String]] =
    Iso(a => Some(a.asJson.noSpaces), _.map { s =>
      decode[A](s).fold(throw _, identity)
    }.getOrElse(default))

  val jsonStringIso: Iso[Json, String] =
    Iso(a => a.asJson.noSpaces, s => parse(s).fold(throw _, identity))
}
